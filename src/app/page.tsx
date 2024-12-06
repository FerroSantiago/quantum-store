import FeaturedProducts from "@/components/FeaturedProducts";
import Business from "@/components/Business";
import { getFeaturedProducts } from "@/lib/actions";

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <section>
        <div className="px-4 md:px-8 mb-12">
          <Business />
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold inline-block relative">
            DESTACADOS DEL MES
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full" />
          </h2>
        </div>
        <div className="px-4 md:px-8">
          <FeaturedProducts products={products} />
        </div>
      </section>
    </div>
  );
}
