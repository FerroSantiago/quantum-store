import { getProducts } from "@/lib/actions";
import ProductsTable from "@/components/admin/ProductsTable";
import SearchInput from "@/components/admin/SearchInput";
import { PageHeader } from "@/components/admin/PageHeader";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <PageHeader title="Gestión de Productos">
        <SearchInput placeholder="Buscar productos..." />
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Agregar Producto
        </Link>
      </PageHeader>
      <ProductsTable products={products} />
    </div>
  );
}
