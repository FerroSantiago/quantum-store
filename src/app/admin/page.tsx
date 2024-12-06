import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          key={"Products"}
          href={"/admin/products"}
          className="block p-6 rounded-lg border hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Productos</h2>
        </Link>
        <Link
          key={"Users"}
          href={"/admin/users"}
          className="block p-6 rounded-lg border hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Usuarios</h2>
        </Link>
        <Link
          key={"Orders"}
          href={"/admin/orders"}
          className="block p-6 rounded-lg border hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">Pedidos</h2>
        </Link>
      </div>
    </div>
  );
}
