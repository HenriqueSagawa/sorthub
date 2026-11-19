/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ComplexityTable } from "@/components/ComplexityTable";
import { SortError, SortNotFound } from "@/components/SortRouteBoundaries";
import { SortVisualizer } from "@/components/SortVisualizer";
import { algorithmsBySlug } from "@/lib/sorts";

export const Route = createFileRoute("/sort/$slug")({
  head: ({ params }) => {
    const algorithm = algorithmsBySlug[params.slug];
    if (!algorithm) {
      return {
        meta: [
          { title: "Algoritmo não encontrado — SortHub" },
          {
            name: "description",
            content: "Algoritmo de ordenação não encontrado.",
          },
          {
            property: "og:title",
            content: "Algoritmo não encontrado — SortHub",
          },
          {
            property: "og:description",
            content: "Algoritmo de ordenação não encontrado.",
          },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary" },
        ],
      };
    }

    const title = `${algorithm.meta.name} — Como funciona, complexidade e visualizador`;
    return {
      meta: [
        { title },
        { name: "description", content: algorithm.meta.shortDescription },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: algorithm.meta.shortDescription,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  loader: ({ params }) => {
    if (!algorithmsBySlug[params.slug]) throw notFound();
    return null;
  },
  notFoundComponent: SortNotFound,
  errorComponent: SortError,
  component: SortPage,
});

function SortPage() {
  const { slug } = Route.useParams();
  const algorithm = algorithmsBySlug[slug];
  if (!algorithm) return <SortNotFound />;

  const { meta } = algorithm;

  return (
    <div className="container mx-auto max-w-5xl animate-fade-in px-4 py-8">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Todos os algoritmos
      </Link>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{meta.category}</Badge>
          <Badge variant={meta.stable ? "default" : "outline"}>
            {meta.stable ? "Estável" : "Não estável"}
          </Badge>
          <Badge variant={meta.inPlace ? "default" : "outline"}>
            {meta.inPlace ? "In-place" : "Fora-de-lugar"}
          </Badge>
          <span className="ml-1 font-mono text-sm text-muted-foreground">
            Médio: {meta.complexity.average}
          </span>
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{meta.name}</h1>
        <p className="text-lg text-muted-foreground">{meta.shortDescription}</p>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Visualizador interativo</h2>
        <SortVisualizer algorithm={algorithm} />
      </section>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-xl font-semibold">Como funciona</h2>
          <p className="leading-relaxed text-foreground/90">{meta.howItWorks}</p>
        </Card>
        <div>
          <h2 className="mb-3 text-xl font-semibold">Complexidade</h2>
          <ComplexityTable meta={meta} />
        </div>
      </div>

      <Card className="mb-8 p-5">
        <h2 className="mb-3 text-xl font-semibold">Pseudocódigo</h2>
        <pre className="overflow-x-auto whitespace-pre rounded-md bg-muted p-4 font-mono text-sm">
          {meta.pseudocode}
        </pre>
      </Card>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-xl font-semibold">Vantagens</h2>
          <ul className="space-y-2">
            {meta.pros.map((pro) => (
              <li key={pro} className="flex gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--bar-sorted)]" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 text-xl font-semibold">Desvantagens</h2>
          <ul className="space-y-2">
            {meta.cons.map((con) => (
              <li key={con} className="flex gap-2 text-sm">
                <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="mb-2 text-xl font-semibold">Quando usar</h2>
        <p className="leading-relaxed text-foreground/90">{meta.whenToUse}</p>
      </Card>
    </div>
  );
}
