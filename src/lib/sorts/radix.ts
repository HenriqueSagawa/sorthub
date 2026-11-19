import type { SortAlgorithm, Step } from "./types";

export const radix: SortAlgorithm = {
  meta: {
    slug: "radix",
    name: "Radix Sort",
    shortDescription:
      "Ordena dígito por dígito, do menos para o mais significativo, usando Counting Sort.",
    category: "Especial",
    complexity: {
      best: "O(d·(n+b))",
      average: "O(d·(n+b))",
      worst: "O(d·(n+b))",
      space: "O(n+b)",
    },
    stable: true,
    inPlace: false,
    howItWorks:
      "Ordena os números processando um dígito por vez, começando pelo menos significativo (LSD). Para cada dígito, usa um algoritmo estável (geralmente Counting Sort) para reorganizar o array. Após processar todos os d dígitos, o array está completamente ordenado.",
    pseudocode: `radixSort(arr):
  max = maior valor em arr
  para exp = 1; max/exp > 0; exp *= 10:
    countingSortPorDigito(arr, exp)

ordena estavelmente pelo dígito (arr[i]/exp) % 10`,
    pros: [
      "Linear em n quando o número de dígitos é pequeno",
      "Estável",
      "Mais rápido que algoritmos comparativos para inteiros longos",
    ],
    cons: ["Usa memória extra O(n+b)", "Funciona apenas com inteiros / strings de tamanho fixo"],
    whenToUse: "Para grandes volumes de inteiros ou strings de tamanho fixo (CEPs, IPs, IDs).",
  },
  generator: function* (arr) {
    const a = arr.slice();
    const n = a.length;
    if (n === 0) return;
    const max = Math.max(...a);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      yield* countingByDigit(a, exp);
    }
    const all = [];
    for (let i = 0; i < n; i++) all.push(i);
    yield { type: "mark-sorted", indices: all };
  },
  pure: (arr) => {
    const a = arr.slice();
    if (a.length === 0) return a;
    const max = Math.max(...a);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      pureCountingByDigit(a, exp);
    }
    return a;
  },
};

function* countingByDigit(a: number[], exp: number): Generator<Step> {
  const n = a.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);
  for (let i = 0; i < n; i++) {
    yield { type: "compare", indices: [i] };
    count[Math.floor(a[i] / exp) % 10]++;
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const d = Math.floor(a[i] / exp) % 10;
    output[count[d] - 1] = a[i];
    count[d]--;
  }
  for (let i = 0; i < n; i++) {
    a[i] = output[i];
    yield { type: "set", index: i, value: a[i] };
  }
}

function pureCountingByDigit(a: number[], exp: number) {
  const n = a.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);
  for (let i = 0; i < n; i++) count[Math.floor(a[i] / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const d = Math.floor(a[i] / exp) % 10;
    output[count[d] - 1] = a[i];
    count[d]--;
  }
  for (let i = 0; i < n; i++) a[i] = output[i];
}