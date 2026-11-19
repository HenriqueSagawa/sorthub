/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SortHub — Hub de algoritmos de ordenação" },
      {
        name: "description",
        content:
          "Aprenda, visualize e teste algoritmos de ordenação com explicações interativas em português.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RouteErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          Sort<span className="text-primary">Hub</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-accent text-accent-foreground" }}
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Algoritmos
          </Link>
          <Link
            to="/sobre"
            activeProps={{ className: "bg-accent text-accent-foreground" }}
            className="rounded-md px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-12 border-t flex justify-around items-center w-full mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
        SortHub — Hub educacional de algoritmos de ordenação.
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
        Desenvolvido por{" "}
        <a
          href="https://github.com/HenriqueSagawa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Henrique Sagawa
        </a>
      </div>
    </footer>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço pode estar incorreto ou a página não existe.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Voltar para os algoritmos
        </Link>
      </div>
    </div>
  );
}

function RouteErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Não foi possível carregar esta página</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro. Tente novamente ou volte para a lista de algoritmos.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            onClick={async () => {
              await router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <Link
            to="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
