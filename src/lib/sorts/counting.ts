import type { SortAlgorithm } from "./types";

export const counting: SortAlgorithm = {
  meta: {
    slug: "counting",
    name: "Counting Sort",
    shortDescription:
      "Conta a frequência de cada valor e reconstrói o array sem comparações.",
    category: "Especial",
    complexity: { best: "O(n+k)", average: "O(n+k)", worst: "O(n+k)", space: "O(k)" },
    stable: true,
    inPlace: false,
    howItWorks:
      "Algoritmo não-comparativo. Cria um array de contagem onde cada índice representa um valor possível. Conta quantas vezes cada valor aparece, calcula a soma cumulativa para descobrir as posições finais, e reconstrói o array ordenado. Funciona melhor quando o intervalo de valores k é pequeno em relação a n.",
    pseudocode: `countingSort(arr):
  max = maior valor em arr
  count = array de tamanho max+1
  para cada x em arr: count[x]++
  saida = []
  para i de 0 até max:
    repita count[i] vezes:
      adicione i em saida
  retorne saida`,
    pros: [
      "Linear O(n+k) — muito rápido quando k é pequeno",
      "Estável",
      "Não usa comparações",
    ],
    cons: [
      "Só funciona com inteiros (ou valores mapeáveis)",
      "Usa O(k) de memória — ruim se valores são esparsos",
    ],
    whenToUse:
      "Quando os valores são inteiros em um intervalo pequeno e conhecido (ex.: idades, notas, bytes).",
  },
  generator: function* (arr) {
    const a = arr.slice();
    const n = a.length;
    if (n === 0) return;
    const max = Math.max(...a);
    const count = new Array(max + 1).fill(0);
    for (let i = 0; i < n; i++) {
      yield { type: "compare", indices: [i] };
      count[a[i]]++;
    }
    let idx = 0;
    for (let v = 0; v <= max; v++) {
      while (count[v] > 0) {
        a[idx] = v;
        yield { type: "set", index: idx, value: v };
        yield { type: "mark-sorted", indices: [idx] };
        idx++;
        count[v]--;
      }
    }
  },
  pure: (arr) => {
    const a = arr.slice();
    if (a.length === 0) return a;
    const max = Math.max(...a);
    const count = new Array(max + 1).fill(0);
    for (const x of a) count[x]++;
    const out: number[] = [];
    for (let v = 0; v <= max; v++) while (count[v]-- > 0) out.push(v);
    return out;
  },
};