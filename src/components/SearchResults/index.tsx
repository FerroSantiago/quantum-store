"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSearch } from "@/contexts/SearchContext";
import { Card } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

export default function SearchResults() {
  const { status } = useSession();
  const {
    searchResults,
    isSearching,
    searchQuery,
    showResults,
    setShowResults,
    clearSearch,
  } = useSearch();
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowResults]);

  if (!searchQuery || !showResults) return null;

  const handleProductClick = (url: string) => {
    clearSearch();
    router.push(url);
  };

  return (
    <div
      ref={resultsRef}
      className="absolute top-full left-0 right-0 bg-background border rounded-md mt-1 shadow-lg max-h-[70vh] overflow-y-auto z-50"
    >
      {isSearching ? (
        <div className="p-4 text-center text-muted-foreground">Buscando...</div>
      ) : searchResults.length > 0 ? (
        <div className="p-2">
          <p className="text-sm text-muted-foreground px-2 py-1">
            {searchResults.length} resultados para &quot;{searchQuery}&quot;
          </p>
          <div className="space-y-2">
            {searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() =>
                  handleProductClick(
                    `/categories/${product.category}/${slugify(product.name)}-${
                      product.id
                    }`
                  )
                }
                className="cursor-pointer"
              >
                <Card className="hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3 p-2">
                    <div className="relative w-12 h-12 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.categoryName}
                      </p>
                      {status === "authenticated" ? (
                        <p className="text-sm font-medium text-primary">
                          ${product.price.toFixed(2)}
                        </p>
                      ) : (
                        <Link
                          href="/auth/login"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearSearch();
                          }}
                        >
                          Inicia sesión para ver el precio
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No se encontraron productos para &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
