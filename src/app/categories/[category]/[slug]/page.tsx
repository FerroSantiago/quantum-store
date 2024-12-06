import { notFound } from "next/navigation";
import { getProduct } from "@/lib/actions";
import { extractIdFromSlug } from "@/lib/utils";
import ProductView from "./ProductView";
import { Suspense } from "react";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

async function ProductContent({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) {
  const id = extractIdFromSlug(slug);
  if (!id) notFound();

  const product = await getProduct(category, id);
  if (!product) notFound();

  return <ProductView product={product} />;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div>Cargando...</div>
        </div>
      }
    >
      <ProductContent
        category={resolvedParams.category}
        slug={resolvedParams.slug}
      />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const id = extractIdFromSlug(resolvedParams.slug);
    if (!id) {
      return { title: "Producto no encontrado" };
    }

    const product = await getProduct(resolvedParams.category, id);
    if (!product) {
      return { title: "Producto no encontrado" };
    }

    return {
      title: `${product.name} | ${product.categoryName}`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.image }],
      },
    };
  } catch {
    return {
      title: "Error",
      description: "Ha ocurrido un error al cargar el producto",
    };
  }
}
