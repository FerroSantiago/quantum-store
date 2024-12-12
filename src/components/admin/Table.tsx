import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchField: (item: T) => string;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  searchField,
}: TableProps<T>) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase();

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      searchField(item).toLowerCase().includes(searchTerm)
    );
  }, [data, searchTerm, searchField]);

  if (filteredData.length === 0) {
    return (
      <p className="text-center py-4 text-muted-foreground">
        {searchTerm
          ? "No se encontraron resultados que coincidan con la búsqueda"
          : "No hay datos disponibles"}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-4 ${
                  column.key === "actions" ? "text-right" : "text-left"
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="border-b hover:bg-muted/50">
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key}`}
                  className={`p-4 ${
                    column.key === "actions" ? "text-right" : ""
                  }`}
                >
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
