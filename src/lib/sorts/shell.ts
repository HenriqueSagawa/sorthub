import type { SortAlgorithm } from "./types";

export const shell: SortAlgorithm = {
  meta: {
    slug: "shell",
    name: "Shell Sort",
    shortDescription:
      "Generalização do Insertion Sort que compara elementos distantes usando gaps.",
    category: "Especial",
    complexity: {
      best: "O(n log n)",
      average: "O(n^1.25)",
      worst: "O(n²)",
      space: "O(1)",
    },
    stable: false,
    inPlace: true,
    howItWorks:
      "É uma extensão do Insertion Sort. Em vez de comparar apenas vizinhos, compara elementos separados por um intervalo (gap). Esse gap diminui a cada iteração até chegar a 1, momento em que executa um Insertion Sort tradicional, mas com o array já quase ordenado.",
    pseudocode: `shellSort(arr):
  gap = n / 2
  enquanto gap > 0:
    para i de gap até n-1:
      temp = arr[i]
      j = i
      enquanto j >= gap e arr[j-gap] > temp:
        arr[j] = arr[j-gap]
        j -= gap
      arr[j] = temp
    gap = gap / 2`,
    pros: [
      "Muito mais rápido que Insertion Sort puro",
      "In-place — O(1) de memória",
      "Simples de implementar",
    ],
    cons: ["Não é estável", "Análise de complexidade depende da sequência de gaps"],
    whenToUse:
      "Para arrays médios (centenas de elementos) onde recursão deve ser evitada e memória é limitada.",
  },
  generator: function* (arr) {
    const a = arr.slice();
    const n = a.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = a[i];
        let j = i;
        while (j >= gap) {
          yield { type: "compare", indices: [j - gap, j] };
          if (a[j - gap] > temp) {
            a[j] = a[j - gap];
            yield { type: "set", index: j, value: a[j] };
            j -= gap;
          } else break;
        }
        a[j] = temp;
        yield { type: "set", index: j, value: temp };
      }
    }
    const all = [];
    for (let i = 0; i < n; i++) all.push(i);
    yield { type: "mark-sorted", indices: all };
  },
  pure: (arr) => {
    const a = arr.slice();
    const n = a.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        const temp = a[i];
        let j = i;
        while (j >= gap && a[j - gap] > temp) {
          a[j] = a[j - gap];
          j -= gap;
        }
        a[j] = temp;
      }
    }
    return a;
  },
};