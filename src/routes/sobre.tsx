/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre ordenação — SortHub" },
      {
        name: "description",
        content:
          "Conceitos fundamentais sobre algoritmos de ordenação: estabilidade, in-place, complexidade e quando usar cada um.",
      },
      { property: "og:title", content: "Sobre ordenação — SortHub" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content:
          "Entenda os conceitos por trás dos algoritmos de ordenação: estabilidade, in-place e complexidade.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="container mx-auto max-w-3xl animate-fade-in px-4 py-10">
      <h1 className="mb-6 text-4xl font-bold">Sobre ordenação</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Ordenação é um dos problemas mais estudados em ciência da computação. Esta
        página reúne os principais conceitos para comparar algoritmos.
      </p>

      <Section title="O que é ordenação?">
        Ordenar uma coleção significa reorganizar seus elementos seguindo um
        critério (geralmente crescente ou decrescente). Algoritmos de ordenação
        são fundamentais em bancos de dados, sistemas de busca, gráficos e em
        quase qualquer aplicação que manipule dados.
      </Section>

      <Section title="Complexidade de tempo">
        Mede como o número de operações cresce em relação ao tamanho da entrada
        (n). É expressa em notação Big-O. As mais comuns em ordenação:
        <ul className="ml-6 mt-2 list-disc space-y-1">
          <li>
            <strong>O(n²)</strong> — algoritmos simples como Bubble, Selection e
            Insertion Sort.
          </li>
          <li>
            <strong>O(n log n)</strong> — algoritmos eficientes como Merge, Quick
            e Heap Sort.
          </li>
          <li>
            <strong>O(n + k)</strong> — algoritmos não comparativos como Counting
            Sort.
          </li>
        </ul>
      </Section>

      <Section title="Complexidade de espaço">
        Indica quanta memória extra o algoritmo consome além da entrada.
        Algoritmos <em>in-place</em> usam apenas O(1) ou O(log n).
      </Section>

      <Section title="Estabilidade">
        Um algoritmo é <strong>estável</strong> se preserva a ordem relativa de
        elementos iguais. Isso importa quando você ordena por múltiplas chaves,
        como ordenar por sobrenome mantendo a ordem original por nome.
      </Section>

      <Section title="In-place vs. fora-de-lugar">
        Algoritmos in-place modificam o array original com pouca memória extra.
        Algoritmos fora-de-lugar, como Merge Sort, alocam estruturas auxiliares.
      </Section>

      <Section title="Comparativo vs. não-comparativo">
        Algoritmos comparativos só sabem comparar pares de elementos — seu
        limite teórico é O(n log n). Algoritmos não comparativos, como Counting
        e Radix Sort, usam propriedades dos valores e podem ser lineares, mas
        têm restrições sobre os dados.
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
      <div className="leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}
