import type { SortMeta } from "@/lib/sorts/types";

export function ComplexityTable({ meta }: { meta: SortMeta }) {
  const rows = [
    { label: "Melhor caso", value: meta.complexity.best },
    { label: "Caso médio", value: meta.complexity.average },
    { label: "Pior caso", value: meta.complexity.worst },
    { label: "Espaço", value: meta.complexity.space },
  ];
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b last:border-b-0">
              <td className="px-4 py-2 font-medium bg-muted/40 w-1/2">{r.label}</td>
              <td className="px-4 py-2 font-mono">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}