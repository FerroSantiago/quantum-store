"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { FeaturedFilterButton } from "../ui/featuredFilterButton";
import Navigation from "./Navigation";
import SearchResults from "../SearchResults";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import {
  ShoppingCart,
  Search,
  X,
  LogIn,
  LogOut,
  UserCircle,
  Settings,
} from "lucide-react";

import { MobileDrawer } from "../MobileDrawer";
import DarkModeSwitch from "./DarkModeSwitch";

export default function Header() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { getTotalItems } = useCart();
  const {
    searchQuery,
    setSearchQuery,
    showMobileSearch,
    setShowMobileSearch,
    setShowResults,
  } = useSearch();

  const totalItems = getTotalItems();

  useEffect(() => {
    return () => setShowMobileSearch(false);
  }, [setShowMobileSearch]);

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="border-b border-border sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {!showMobileSearch && (
            <Link href="/" className="text-2xl font-bold shrink-0">
              <img src="/logoQuantum.png" alt="Quantum Store" className="h-10 w-25" />
            </Link>
          )}

          <div
            className={`relative ${showMobileSearch ? "flex-1" : "hidden sm:block flex-1 max-w-xl"
              }`}
          >
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <SearchResults />
          </div>

          {showMobileSearch ? (
            <FeaturedFilterButton
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
            >
              <X className="h-5 w-5" />
            </FeaturedFilterButton>
          ) : (
            <>
              <FeaturedFilterButton
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="h-5 w-5" />
              </FeaturedFilterButton>

              <div className="ml-auto flex items-center gap-4">
                {/* Sesión - Solo visible en desktop */}
                <div className="hidden sm:flex items-center gap-4">
                  {authStatus === "authenticated" ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <UserCircle className="h-5 w-5" />
                        <span className="hidden sm:inline">
                          {session?.user?.name || session?.user?.email}
                        </span>
                      </Link>
                      {session?.user?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Settings className="h-5 w-5" />
                          <span>Panel Admin</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Iniciar Sesión</span>
                    </Link>
                  )}
                </div>

                <Link href="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <DarkModeSwitch />

                {/* Menú móvil */}
                <MobileDrawer />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="hidden sm:block">
        <Navigation variant="horizontal" />
      </div>
    </header>
  );
}
