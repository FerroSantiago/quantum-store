"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

interface FeaturedProductsProps {
  products: Product[];
}

type ScreenSize = "mobile" | "tablet" | "desktop" | "large";

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [screenSize, setScreenSize] = useState<ScreenSize>("desktop");
  const [currentPage, setCurrentPage] = useState(0);

  const getSlidesPerView = useCallback(() => {
    switch (screenSize) {
      case "mobile":
        return 1;
      case "tablet":
        return 2;
      case "desktop":
        return 3;
      case "large":
        return 4;
      default:
        return 4;
    }
  }, [screenSize]);

  const getGroupedProducts = useCallback(() => {
    const slides = getSlidesPerView();
    const grouped = [];
    for (let i = 0; i < productsData.length; i += slides) {
      grouped.push(productsData.slice(i, i + slides));
    }
    return grouped;
  }, [productsData, getSlidesPerView]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  });

  useEffect(() => {
    const loadProducts = async () => {
      const resolvedProducts = await products;
      setProductsData(resolvedProducts);
    };
    loadProducts();
  }, [products]);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("mobile");
      else if (width < 768) setScreenSize("tablet");
      else if (width < 1024) setScreenSize("desktop");
      else setScreenSize("large");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const currentGroup = emblaApi.selectedScrollSnap();
      setCurrentPage(currentGroup);
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!productsData.length) {
    return (
      <div className="animate-pulse">
        <div
          className={`grid gap-6`}
          style={{ gridTemplateColumns: `repeat(${getSlidesPerView()}, 1fr)` }}
        >
          {[...Array(getSlidesPerView())].map((_, index) => (
            <div key={index} className="h-[400px] bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const groupedProducts = getGroupedProducts();

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {groupedProducts.map((group, groupIndex) => (
            <div key={groupIndex} className="flex" style={{ flex: "0 0 100%" }}>
              {group.map((product) => (
                <div
                  key={product.id}
                  className="flex-none pl-4"
                  style={{ width: `${100 / getSlidesPerView()}%` }}
                >
                  <div className="mr-4">
                    <ProductCard {...product} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {groupedProducts.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all border border-secondary ${index === currentPage
              ? "bg-primary"
              : "bg-secondary"
              }`}
            aria-label={`Ir al grupo ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>

      {screenSize !== "mobile" && groupedProducts.length > 1 && (
        <>
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 flex items-center justify-center"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Anterior grupo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 flex items-center justify-center"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Siguiente grupo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
