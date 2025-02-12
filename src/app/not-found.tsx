import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
      <p className="mt-4 text-2xl">La página que buscas no existe.</p>
      <Link href="/" className="mt-6 text-xl text-blue-500 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}