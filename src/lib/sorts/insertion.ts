import type { SortAlgorithm } from "./types";

export const insertion: SortAlgorithm = {
  meta: {
    slug: "insertion",
    name: "Insertion Sort",
    shortDescription:
      "Constrói o array ordenado um elemento por vez, inserindo cada novo na posição correta.",
    category: "Clássico",
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    stable: true,
    inPlace: true,
    howItWorks:
      "Funciona como organizar cartas na mão: pega-se uma carta por vez da pilha e a insere na posição correta entre as cartas já organizadas. Para cada elemento, ele desloca os elementos maiores uma posição para a direita até encontrar o local correto.",
    pseudocode: `para i de 1 até n-1:
  chave = arr[i]
  j = i - 1
  enquanto j >= 0 e arr[j] > chave:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = chave`,
    pros: [
      "Muito rápido para arrays pequenos ou quase ordenados",
      "Estável e in-place",
      "Algoritmo online (pode ordenar conforme recebe dados)",
    ],
    cons: ["Lento para arrays grandes — O(n²)"],
    whenToUse:
      "Para arrays pequenos (< 50) ou quase ordenados. É usado internamente em Timsort/Introsort como caso base.",
  },
  generator: function* (arr) {
    const a = arr.slice();
    const n = a.length;
    for (let i = 1; i < n; i++) {
      const chave = a[i];
      let j = i - 1;
      while (j >= 0) {
        yield { type: "compare", indices: [j, j + 1] };
        if (a[j] > chave) {
          a[j + 1] = a[j];
          yield { type: "set", index: j + 1, value: a[j] };
          j--;
        } else break;
      }
      a[j + 1] = chave;
      yield { type: "set", index: j + 1, value: chave };
    }
    const all = [];
    for (let i = 0; i < n; i++) all.push(i);
    yield { type: "mark-sorted", indices: all };
  },
  pure: (arr) => {
    const a = arr.slice();
    for (let i = 1; i < a.length; i++) {
      const chave = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > chave) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = chave;
    }
    return a;
  },
};