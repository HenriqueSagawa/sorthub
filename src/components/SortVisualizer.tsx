import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Shuffle, Gauge, Volume2, VolumeX } from "lucide-react";
import type { SortAlgorithm, Step } from "@/lib/sorts/types";

type BarState = "default" | "comparing" | "swapping" | "sorted" | "pivot";

function randomArray(size: number) {
  const a: number[] = [];
  for (let i = 0; i < size; i++) a.push(Math.floor(Math.random() * 100) + 5);
  return a;
}

const STATE_COLOR: Record<BarState, string> = {
  default: "var(--bar-default)",
  comparing: "var(--bar-comparing)",
  swapping: "var(--bar-swapping)",
  sorted: "var(--bar-sorted)",
  pivot: "var(--bar-pivot)",
};

export function SortVisualizer({ algorithm }: { algorithm: SortAlgorithm }) {
  const [size, setSize] = useState(40);
  const [speed, setSpeed] = useState(50); // 1..100
  // valores determinísticos no 1º render (SSR) para evitar hydration mismatch;
  // o array aleatório é gerado no useEffect abaixo
  const [array, setArray] = useState<number[]>(() =>
    Array.from({ length: 40 }, (_, i) => 5 + ((i * 37) % 100)),
  );
  const [states, setStates] = useState<BarState[]>(() => new Array(40).fill("default"));
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const cancelRef = useRef(false);
  const pausedRef = useRef(false);
  const speedRef = useRef(speed);
  const soundOnRef = useRef(soundOn);
  const audioCtxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) audioCtxRef.current = new Ctor();
    }
    if (audioCtxRef.current?.state === "suspended") void audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playTone = useCallback((value: number, max: number) => {
    if (!soundOnRef.current) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    const ratio = Math.min(1, Math.max(0, value / max));
    const freq = 200 + ratio * 800; // 200Hz..1000Hz, tom sobe com o valor
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }, []);

  const regenerate = useCallback(
    (n: number) => {
      const arr = randomArray(n);
      setArray(arr);
      setStates(new Array(n).fill("default"));
      setComparisons(0);
      setSwaps(0);
      setExecutionTime(null);
    },
    [],
  );

  // gera o array aleatório apenas no cliente, após a hidratação
  useEffect(() => {
    regenerate(40);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSizeChange = (v: number | readonly number[]) => {
    if (isRunning) return;
    const n = typeof v === "number" ? v : v[0];
    setSize(n);
    regenerate(n);
  };

  const handleShuffle = () => {
    if (isRunning) return;
    regenerate(size);
  };

  const delayMs = () => {
    // speed 1..100 => delay 200ms..1ms (inverse)
    return Math.max(1, Math.round(200 - speed * 1.99));
  };

  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

  const waitWhilePaused = async () => {
    while (pausedRef.current && !cancelRef.current) await sleep(50);
  };

  const handleStart = async () => {
    if (isRunning) {
      pausedRef.current = !pausedRef.current;
      setIsPaused(pausedRef.current);
      return;
    }
    getAudioCtx();
    // measure pure time first
    const copy = array.slice();
    const t0 = performance.now();
    algorithm.pure(copy);
    const t1 = performance.now();
    setExecutionTime(t1 - t0);

    // animate
    const working = array.slice();
    const workStates: BarState[] = new Array(working.length).fill("default");
    setStates(workStates.slice());
    setComparisons(0);
    setSwaps(0);
    setIsRunning(true);
    cancelRef.current = false;
    pausedRef.current = false;
    setIsPaused(false);

    let comp = 0;
    let sw = 0;
    let pivotIdx = -1;
    const sortedSet = new Set<number>();

    const gen = algorithm.generator(working);
    let step = gen.next();
    while (!step.done) {
      if (cancelRef.current) break;
      await waitWhilePaused();
      const s = step.value as Step;
      // reset transient states (keep sorted + pivot)
      for (let i = 0; i < workStates.length; i++) {
        if (workStates[i] === "comparing" || workStates[i] === "swapping") {
          workStates[i] = sortedSet.has(i) ? "sorted" : i === pivotIdx ? "pivot" : "default";
        }
      }

      if (s.type === "compare") {
        comp++;
        for (const idx of s.indices) {
          if (!sortedSet.has(idx) && idx !== pivotIdx) workStates[idx] = "comparing";
        }
      } else if (s.type === "swap") {
        sw++;
        const [i, j] = s.indices;
        [working[i], working[j]] = [working[j], working[i]];
        playTone(Math.max(working[i], working[j]), maxVal);
        if (!sortedSet.has(i)) workStates[i] = "swapping";
        if (!sortedSet.has(j)) workStates[j] = "swapping";
      } else if (s.type === "set") {
        sw++;
        working[s.index] = s.value;
        playTone(s.value, maxVal);
        if (!sortedSet.has(s.index)) workStates[s.index] = "swapping";
      } else if (s.type === "mark-sorted") {
        for (const idx of s.indices) {
          sortedSet.add(idx);
          workStates[idx] = "sorted";
        }
      } else if (s.type === "pivot") {
        pivotIdx = s.index;
        if (!sortedSet.has(pivotIdx)) workStates[pivotIdx] = "pivot";
      }

      setArray(working.slice());
      setStates(workStates.slice());
      setComparisons(comp);
      setSwaps(sw);
      await sleep(delayMs());
      step = gen.next();
    }

    if (!cancelRef.current) {
      for (let i = 0; i < workStates.length; i++) workStates[i] = "sorted";
      setStates(workStates.slice());
    }
    setIsRunning(false);
    pausedRef.current = false;
    setIsPaused(false);
  };

  const handleReset = () => {
    cancelRef.current = true;
    pausedRef.current = false;
    setIsPaused(false);
    setIsRunning(false);
    regenerate(size);
  };

  const maxVal = useMemo(() => Math.max(...array, 1), [array]);

  const slowWarning = size > 80 && ["bubble", "selection", "insertion"].includes(algorithm.meta.slug);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Stat label="Tamanho" value={size.toString()} />
        <Stat label="Comparações" value={comparisons.toLocaleString("pt-BR")} />
        <Stat label="Trocas / Escritas" value={swaps.toLocaleString("pt-BR")} />
        <Stat
          label="Tempo de execução"
          value={executionTime !== null ? `${executionTime.toFixed(3)} ms` : "—"}
        />
      </div>

      <div className="h-64 sm:h-80 w-full bg-muted/40 rounded-lg flex items-end gap-px p-2 overflow-hidden">
        {array.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-75"
            style={{
              height: `${(v / maxVal) * 100}%`,
              backgroundColor: STATE_COLOR[states[i] ?? "default"],
              minWidth: 2,
            }}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Tamanho do array: {size}</label>
            {slowWarning && (
              <span className="text-xs text-destructive">
                Aviso: este algoritmo é O(n²) — pode demorar para tamanhos grandes
              </span>
            )}
          </div>
          <Slider
            min={10}
            max={200}
            step={5}
            value={[size]}
            onValueChange={handleSizeChange}
            disabled={isRunning}
          />
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-1 mb-2">
            <Gauge className="h-4 w-4" /> Velocidade da animação
          </label>
          <Slider min={1} max={100} value={[speed]} onValueChange={(v) => setSpeed(typeof v === "number" ? v : v[0])} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleStart} className="gap-2">
            {isRunning && !isPaused ? (
              <>
                <Pause className="h-4 w-4" /> Pausar
              </>
            ) : isRunning && isPaused ? (
              <>
                <Play className="h-4 w-4" /> Continuar
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Iniciar
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleShuffle} disabled={isRunning} className="gap-2">
            <Shuffle className="h-4 w-4" /> Embaralhar
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Resetar
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundOn((v) => !v)}
            aria-label={soundOn ? "Desativar som" : "Ativar som"}
            title={soundOn ? "Desativar som" : "Ativar som"}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
          <Legend color={STATE_COLOR.default} label="Padrão" />
          <Legend color={STATE_COLOR.comparing} label="Comparando" />
          <Legend color={STATE_COLOR.swapping} label="Trocando / Escrevendo" />
          <Legend color={STATE_COLOR.pivot} label="Pivô" />
          <Legend color={STATE_COLOR.sorted} label="Ordenado" />
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}