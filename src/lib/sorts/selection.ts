import type { SortAlgorithm } from "./types";

export const selection: SortAlgorithm = {
  meta: {
    slug: "selection",
    name: "Selection Sort",
    shortDescription:
      "Encontra o menor elemento restante e o coloca na próxima posição ordenada.",
    category: "Clássico",
    complexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    stable: false,
    inPlace: true,
    howItWorks:
      "O Selection Sort divide o array em duas partes: ordenada (à esquerda) e não-ordenada (à direita). A cada iteração, ele varre a parte não-ordenada para encontrar o menor elemento e o troca com o primeiro elemento da parte não-ordenada, expandindo a parte ordenada.",
    pseudocode: `para i de 0 até n-1:
  min = i
  para j de i+1 até n-1:
    se arr[j] < arr[min]:
      min = j
  trocar(arr[i], arr[min])`,
    pros: [
      "Faz no máximo n trocas — útil quando escrever é caro",
      "Simples de implementar e entender",
      "In-place (não usa memória extra)",
    ],
    cons: ["Sempre O(n²), mesmo em array já ordenado", "Não é estável"],
    whenToUse:
      "Quando o custo de escrita é alto e o de comparação é baixo, ou para arrays muito pequenos.",
  },
  generator: function* (arr) {
    const a = arr.slice();
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        yield { type: "compare", indices: [min, j] };
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        yield { type: "swap", indices: [i, min] };
      }
      yield { type: "mark-sorted", indices: [i] };
    }
    yield { type: "mark-sorted", indices: [n - 1] };
  },
  pure: (arr) => {
    const a = arr.slice();
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) if (a[j] < a[min]) min = j;
      if (min !== i) [a[i], a[min]] = [a[min], a[i]];
    }
    return a;
  },
};