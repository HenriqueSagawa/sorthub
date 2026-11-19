import { Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function SortNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">
      <h1 className="text-2xl font-semibold mb-2">Algoritmo não encontrado</h1>
      <p className="text-muted-foreground mb-4">
        Não temos um algoritmo com esse identificador.
      </p>
      <Link to="/" className="text-primary hover:underline">
        ← Voltar para a lista
      </Link>
    </div>
  );
}

export function SortError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">
      <h1 className="text-2xl font-semibold mb-2">Não foi possível carregar o algoritmo</h1>
      <div className="flex justify-center gap-2 mt-4">
        <Button onClick={async () => { await router.invalidate(); reset(); }}>
          Tentar novamente
        </Button>
        <Button variant="outline" onClick={() => router.navigate({ to: "/" })}>
          Todos os algoritmos
        </Button>
      </div>
    </div>
  );
}