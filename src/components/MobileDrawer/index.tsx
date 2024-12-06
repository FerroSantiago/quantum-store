"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Menu, X, LogIn, LogOut, UserCircle, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "../Header/Navigation";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false,
      });
      setOpen(false);
      router.push("/");
      //router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="sm:hidden" aria-label="Abrir menú">
          <Menu className="h-6 w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />
        <Dialog.Content
          className="fixed top-0 right-0 z-50 h-full w-[300px] flex flex-col bg-background shadow-xl data-[state=open]:animate-slideInRight data-[state=closed]:animate-slideOutRight"
          aria-describedby="drawer-description"
        >
          <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>
          <Dialog.Description id="drawer-description" className="sr-only">
            Menú principal con opciones de navegación, búsqueda y cuenta de
            usuario
          </Dialog.Description>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Menú</h2>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-2 hover:bg-muted"
                  aria-label="Cerrar menú"
                >
                  <X className="h-6 w-6" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b">
              {authStatus === "authenticated" ? (
                <div className="space-y-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>{session?.user?.name || session?.user?.email}</span>
                  </Link>
                  {session?.user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Panel Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  onClick={handleClose}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </Link>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-4">Categorías</h3>
              <div className="pl-6">
                <Navigation variant="vertical" onNavigate={handleClose} />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
