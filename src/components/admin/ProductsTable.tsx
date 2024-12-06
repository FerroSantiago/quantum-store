"use client";

import { useMemo } from "react";
import { Product } from "@/lib/types";
import { deleteProduct } from "@/lib/actions/admin/products";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductsTable({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }, [products, searchTerm]);

  const handleDelete = async (productId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProduct(productId);
        toast.success("Producto eliminado correctamente");
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Error al eliminar el producto");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      {filteredProducts.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">
          {searchTerm
            ? "No se encontraron productos que coincidan con la búsqueda"
            : "No hay productos disponibles"}
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Precio</th>
              <th className="text-left p-4">Categoría</th>
              <th className="text-left p-4">Destacado</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-muted/50">
                <td className="p-4">{product.name}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4">{product.categoryName}</td>
                <td className="p-4">{product.featured ? "Sí" : "No"}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 hover:bg-muted rounded-md"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-muted rounded-md text-red-500 hover:bg-red-50"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
