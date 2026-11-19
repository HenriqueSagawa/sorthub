import type { SortAlgorithm, Step } from "./types";

export const heap: SortAlgorithm = {
  meta: {
    slug: "heap",
    name: "Heap Sort",
    shortDescription:
      "Constrói um heap máximo e extrai o maior elemento repetidamente.",
    category: "Eficiente",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1)",
    },
    stable: false,
    inPlace: true,
    howItWorks:
      "Primeiro, transforma o array em um heap máximo (estrutura de árvore binária onde o pai é sempre maior que os filhos). Em seguida, troca a raiz (maior elemento) com o último elemento, reduz o tamanho do heap em 1 e reorganiza (heapify). Repete até o heap estar vazio.",
    pseudocode: `heapSort(arr):
  construirHeapMax(arr)
  para i de n-1 até 1:
    trocar(arr[0], arr[i])
    heapify(arr, 0, i)

heapify desce o elemento até satisfazer
a propriedade de heap máximo`,
    pros: [
      "Garantia O(n log n) em todos os casos",
      "In-place — O(1) de memória extra",
      "Não tem pior caso ruim como o Quick Sort",
    ],
    cons: ["Não é estável", "Constantes maiores que Quick Sort na prática", "Cache-locality ruim"],
    whenToUse:
      "Quando se precisa de garantia O(n log n) com pouca memória, ou em sistemas embarcados. Também usado como fallback no Introsort.",
  },
  generator: function* (arr) {
    const a = arr.slice();
    const n = a.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(a, n, i);
    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      yield { type: "swap", indices: [0, i] };
      yield { type: "mark-sorted", indices: [i] };
      yield* heapify(a, i, 0);
    }
    yield { type: "mark-sorted", indices: [0] };
  },
  pure: (arr) => {
    const a = arr.slice();
    const n = a.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) pureHeapify(a, n, i);
    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      pureHeapify(a, i, 0);
    }
    return a;
  },
};

function* heapify(a: number[], n: number, i: number): Generator<Step> {
  let maior = i;
  const l = 2 * i + 1,
    r = 2 * i + 2;
  if (l < n) {
    yield { type: "compare", indices: [maior, l] };
    if (a[l] > a[maior]) maior = l;
  }
  if (r < n) {
    yield { type: "compare", indices: [maior, r] };
    if (a[r] > a[maior]) maior = r;
  }
  if (maior !== i) {
    [a[i], a[maior]] = [a[maior], a[i]];
    yield { type: "swap", indices: [i, maior] };
    yield* heapify(a, n, maior);
  }
}

function pureHeapify(a: number[], n: number, i: number) {
  let maior = i;
  const l = 2 * i + 1,
    r = 2 * i + 2;
  if (l < n && a[l] > a[maior]) maior = l;
  if (r < n && a[r] > a[maior]) maior = r;
  if (maior !== i) {
    [a[i], a[maior]] = [a[maior], a[i]];
    pureHeapify(a, n, maior);
  }
}