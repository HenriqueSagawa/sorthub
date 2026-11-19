import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SortMeta } from "@/lib/sorts/types";

export function AlgorithmCard({ meta }: { meta: SortMeta }) {
  return (
    <Link
      to="/sort/$slug"
      params={{ slug: meta.slug }}
      className="group block animate-fade-in"
    >
      <Card className="h-full p-5 transition-all hover:shadow-md hover:border-primary/40">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{meta.category}</Badge>
          <span className="text-xs font-mono text-muted-foreground">
            {meta.complexity.average}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-1.5">{meta.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {meta.shortDescription}
        </p>
        <div className="flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all">
          Explorar <ArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
}