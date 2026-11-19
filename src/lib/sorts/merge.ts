import type { SortAlgorithm, Step } from "./types";

export const merge: SortAlgorithm = {
  meta: {
    slug: "merge",
    name: "Merge Sort",
    shortDescription:
      "Divide o array recursivamente, ordena cada metade e as combina (merge).",
    category: "Eficiente",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
    },
    stable: true,
    inPlace: false,
    howItWorks:
      "Aplica o paradigma dividir-para-conquistar: divide o array ao meio recursivamente até obter sub-arrays de tamanho 1 (já ordenados por definição), e depois mescla os sub-arrays comparando elemento a elemento para produzir partes ordenadas cada vez maiores.",
    pseudocode: `mergeSort(arr):
  se tamanho <= 1: retorne arr
  meio = tamanho / 2
  esq = mergeSort(arr[0..meio])
  dir = mergeSort(arr[meio..n])
  retorne merge(esq, dir)

merge(esq, dir):
  combine em ordem comparando o primeiro de cada`,
    pros: [
      "Performance garantida O(n log n) em todos os casos",
      "Estável",
      "Excelente para listas ligadas e ordenação externa",
    ],
    cons: ["Usa O(n) de memória extra", "Mais lento na prática que Quick Sort para arrays"],
    whenToUse:
      "Quando estabilidade é necessária, ordenando dados muito grandes (ordenação externa) ou estruturas como listas ligadas.",
  },
  generator: function* (arr) {
    const a = arr.slice();
    yield* mergeSort(a, 0, a.length - 1);
    const all = [];
    for (let i = 0; i < a.length; i++) all.push(i);
    yield { type: "mark-sorted", indices: all };
  },
  pure: (arr) => {
    const a = arr.slice();
    pureMergeSort(a, 0, a.length - 1);
    return a;
  },
};

function* mergeSort(a: number[], l: number, r: number): Generator<Step> {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  yield* mergeSort(a, l, m);
  yield* mergeSort(a, m + 1, r);
  yield* mergeMerge(a, l, m, r);
}

function* mergeMerge(a: number[], l: number, m: number, r: number): Generator<Step> {
  const left = a.slice(l, m + 1);
  const right = a.slice(m + 1, r + 1);
  let i = 0,
    j = 0,
    k = l;
  while (i < left.length && j < right.length) {
    yield { type: "compare", indices: [l + i, m + 1 + j] };
    if (left[i] <= right[j]) {
      a[k] = left[i++];
    } else {
      a[k] = right[j++];
    }
    yield { type: "set", index: k, value: a[k] };
    k++;
  }
  while (i < left.length) {
    a[k] = left[i++];
    yield { type: "set", index: k, value: a[k] };
    k++;
  }
  while (j < right.length) {
    a[k] = right[j++];
    yield { type: "set", index: k, value: a[k] };
    k++;
  }
}

function pureMergeSort(a: number[], l: number, r: number) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  pureMergeSort(a, l, m);
  pureMergeSort(a, m + 1, r);
  const left = a.slice(l, m + 1);
  const right = a.slice(m + 1, r + 1);
  let i = 0,
    j = 0,
    k = l;
  while (i < left.length && j < right.length) {
    a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  }
  while (i < left.length) a[k++] = left[i++];
  while (j < right.length) a[k++] = right[j++];
}