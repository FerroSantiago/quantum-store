import { getProducts } from "@/lib/actions";
import ProductsTable from "@/components/admin/ProductsTable";
import AdminSearch from "@/components/admin/AdminSearch";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Productos</h2>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Agregar Producto
        </Link>
      </div>
      <div className="mb-6">
        <AdminSearch />
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
