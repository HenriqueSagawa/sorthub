import type { SortAlgorithm } from "./types";

export const bubble: SortAlgorithm = {
  meta: {
    slug: "bubble",
    name: "Bubble Sort",
    shortDescription:
      "Compara pares adjacentes e os troca de lugar até o array estar ordenado.",
    category: "Clássico",
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    stable: true,
    inPlace: true,
    howItWorks:
      "O Bubble Sort percorre o array repetidamente, comparando elementos vizinhos e trocando-os quando estão fora de ordem. A cada passagem, o maior elemento 'borbulha' até o fim do array. O processo termina quando uma passagem inteira ocorre sem nenhuma troca.",
    pseudocode: `para i de 0 até n-1:
  trocou = falso
  para j de 0 até n-i-2:
    se arr[j] > arr[j+1]:
      trocar(arr[j], arr[j+1])
      trocou = verdadeiro
  se não trocou: pare`,
    pros: [
      "Implementação extremamente simples",
      "Estável (não troca elementos iguais)",
      "Detecta array já ordenado em O(n)",
    ],
    cons: [
      "Muito lento para arrays grandes — O(n²)",
      "Faz muitas trocas desnecessárias",
    ],
    whenToUse:
      "Apenas para fins didáticos ou para arrays muito pequenos (< 20 elementos). Em produção, prefira algoritmos O(n log n).",
  },
  generator: function* (arr) {
    const a = arr.slice();
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let trocou = false;
      for (let j = 0; j < n - i - 1; j++) {
        yield { type: "compare", indices: [j, j + 1] };
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          yield { type: "swap", indices: [j, j + 1] };
          trocou = true;
        }
      }
      yield { type: "mark-sorted", indices: [n - i - 1] };
      if (!trocou) {
        const remaining = [];
        for (let k = 0; k < n - i - 1; k++) remaining.push(k);
        yield { type: "mark-sorted", indices: remaining };
        break;
      }
    }
    yield { type: "mark-sorted", indices: [0] };
  },
  pure: (arr) => {
    const a = arr.slice();
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let trocou = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          trocou = true;
        }
      }
      if (!trocou) break;
    }
    return a;
  },
};