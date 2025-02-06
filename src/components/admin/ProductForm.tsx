"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { categories } from "@/lib/constants";
import { createProduct, updateProduct } from "@/lib/actions/admin/products";
import { Product } from "@/lib/types";

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

export default function ProductForm({
  initialData,
  isEditing,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const selectedCategoryId = formData.get("category") as string;

      const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

      if (!selectedCategory) {
        throw new Error("Categoría no válida.");
      }

      formData.set("category", selectedCategory.id);

      if (isEditing && initialData) {
        await updateProduct(initialData.id, formData);
        toast.success("Producto actualizado correctamente");
      } else {
        await createProduct(formData);
        toast.success("Producto creado correctamente");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Error al procesar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-md border border-border bg-transparent p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={initialData?.name}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Precio
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            defaultValue={initialData?.price}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData?.description}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            URL de la imagen
          </label>
          <input
            type="url"
            id="image"
            name="image"
            defaultValue={initialData?.image}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initialData?.category}
            required
            className={`${inputClasses} dark:bg-background dark:text-foreground dark:border-border`}
          >
            <option value="" className="bg-background text-foreground">Seleccionar categoría</option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="bg-background text-foreground"
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            defaultChecked={initialData?.featured}
            className="rounded focus:ring-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Producto destacado
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-border rounded-md"
        >
          {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-border rounded-md"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
