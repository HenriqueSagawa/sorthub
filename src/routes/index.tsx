/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { algorithms } from "@/lib/sorts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SortHub — Hub de algoritmos de ordenação" },
      {
        name: "description",
        content:
          "Explore 9 algoritmos de ordenação com explicações, complexidade e visualização interativa em português.",
      },
      {
        property: "og:title",
        content: "SortHub — Hub de algoritmos de ordenação",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content:
          "Explore 9 algoritmos de ordenação com explicações e visualização interativa em PT-BR.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <section className="mx-auto mb-12 max-w-2xl animate-fade-in text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Hub de algoritmos de ordenação
        </h1>
        <p className="text-lg text-muted-foreground">
          Aprenda como funcionam, compare complexidades e teste cada algoritmo com
          visualização animada e medição de tempo real.
        </p>
      </section>

      <section className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {algorithms.map((algorithm) => (
          <AlgorithmCard key={algorithm.meta.slug} meta={algorithm.meta} />
        ))}
      </section>

      <section className="animate-fade-in">
        <h2 className="mb-4 text-2xl font-bold">Comparativo de complexidade</h2>
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Algoritmo</th>
                  <th className="px-4 py-2 text-left font-medium">Melhor</th>
                  <th className="px-4 py-2 text-left font-medium">Médio</th>
                  <th className="px-4 py-2 text-left font-medium">Pior</th>
                  <th className="px-4 py-2 text-left font-medium">Espaço</th>
                  <th className="px-4 py-2 text-left font-medium">Estável</th>
                </tr>
              </thead>
              <tbody>
                {algorithms.map(({ meta }) => (
                  <tr key={meta.slug} className="border-t">
                    <td className="px-4 py-2 font-medium">{meta.name}</td>
                    <td className="px-4 py-2 font-mono">{meta.complexity.best}</td>
                    <td className="px-4 py-2 font-mono">{meta.complexity.average}</td>
                    <td className="px-4 py-2 font-mono">{meta.complexity.worst}</td>
                    <td className="px-4 py-2 font-mono">{meta.complexity.space}</td>
                    <td className="px-4 py-2">{meta.stable ? "Sim" : "Não"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
