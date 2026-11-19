import type { SortAlgorithm, Step } from "./types";

export const quick: SortAlgorithm = {
  meta: {
    slug: "quick",
    name: "Quick Sort",
    shortDescription:
      "Escolhe um pivô, particiona o array em torno dele e ordena recursivamente.",
    category: "Eficiente",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
    },
    stable: false,
    inPlace: true,
    howItWorks:
      "Escolhe um elemento como pivô e particiona o array de forma que valores menores fiquem à esquerda e maiores à direita. Em seguida, aplica recursivamente o mesmo processo em cada partição. A escolha do pivô é crucial para a performance.",
    pseudocode: `quickSort(arr, baixo, alto):
  se baixo < alto:
    p = particionar(arr, baixo, alto)
    quickSort(arr, baixo, p-1)
    quickSort(arr, p+1, alto)

particionar usa o último elemento como pivô (Lomuto)`,
    pros: [
      "Geralmente o mais rápido na prática",
      "In-place (pouca memória extra)",
      "Excelente cache-locality",
    ],
    cons: [
      "Pior caso O(n²) com pivô ruim",
      "Não é estável",
      "Recursão pode estourar a pilha em arrays grandes ordenados",
    ],
    whenToUse:
      "Caso geral em arrays na memória. É a base de implementações como std::sort (C++) com fallback para Heap Sort (Introsort).",
  },
  generator: function* (arr) {
    const a = arr.slice();
    yield* quickSort(a, 0, a.length - 1);
    const all = [];
    for (let i = 0; i < a.length; i++) all.push(i);
    yield { type: "mark-sorted", indices: all };
  },
  pure: (arr) => {
    const a = arr.slice();
    pureQuick(a, 0, a.length - 1);
    return a;
  },
};

function* quickSort(a: number[], low: number, high: number): Generator<Step> {
  if (low < high) {
    const p = yield* partition(a, low, high);
    yield* quickSort(a, low, p - 1);
    yield* quickSort(a, p + 1, high);
  } else if (low === high) {
    yield { type: "mark-sorted", indices: [low] };
  }
}

function* partition(a: number[], low: number, high: number): Generator<Step, number> {
  const pivot = a[high];
  yield { type: "pivot", index: high };
  let i = low - 1;
  for (let j = low; j < high; j++) {
    yield { type: "compare", indices: [j, high] };
    if (a[j] <= pivot) {
      i++;
      if (i !== j) {
        [a[i], a[j]] = [a[j], a[i]];
        yield { type: "swap", indices: [i, j] };
      }
    }
  }
  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  yield { type: "swap", indices: [i + 1, high] };
  yield { type: "mark-sorted", indices: [i + 1] };
  return i + 1;
}

function pureQuick(a: number[], low: number, high: number) {
  if (low >= high) return;
  const pivot = a[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (a[j] <= pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  pureQuick(a, low, i);
  pureQuick(a, i + 2, high);
}