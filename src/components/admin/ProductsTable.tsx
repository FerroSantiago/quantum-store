// src/components/admin/ProductsTable.tsx
"use client";

import { Product } from "@/lib/types";
import { deleteProduct } from "@/lib/actions/admin/products";
import { toast } from "sonner";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Table } from "./Table";

export default function ProductsTable({ products }: { products: Product[] }) {
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

  const columns = [
    {
      key: "name",
      header: "Nombre",
      cell: (product: Product) => product.name,
    },
    {
      key: "price",
      header: "Precio",
      cell: (product: Product) => `$${product.price.toFixed(2)}`,
    },
    {
      key: "category",
      header: "Categoría",
      cell: (product: Product) => product.categoryName,
    },
    {
      key: "featured",
      header: "Destacado",
      cell: (product: Product) => (product.featured ? "Sí" : "No"),
    },
    {
      key: "actions",
      header: "",
      cell: (product: Product) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="p-2"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(product.id)}
            className="p-2 text-red-500"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={products}
      columns={columns}
      searchField={(product) => product.name}
    />
  );
}
