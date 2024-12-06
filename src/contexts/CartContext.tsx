"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/lib/types";
import {
  addToCart as addToCartDB,
  removeFromCart as removeFromCartDB,
  updateCartItemQuantity,
  getCart,
} from "@/lib/actions";

interface DBCartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

interface CartItem {
  id: string; // ID del CartItem
  product: Product;
  quantity: number;
  productId: string; // ID del producto
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    async function loadCart() {
      if (status === "authenticated") {
        try {
          const cartItems = await getCart();
          setItems(
            cartItems.map((item: DBCartItem) => ({
              id: item.id,
              product: item.product,
              productId: item.productId,
              quantity: item.quantity,
            }))
          );
        } catch (error) {
          console.error("Error al cargar el carrito:", error);
        }
      } else {
        setItems([]);
      }
      setIsLoading(false);
    }

    loadCart();
  }, [status]);

  const addToCart = async (product: Product) => {
    if (status !== "authenticated") {
      throw new Error("Debes iniciar sesión para agregar items al carrito");
    }

    try {
      const newItem = await addToCartDB(product.id);
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...currentItems,
          {
            id: newItem.id,
            product,
            productId: product.id,
            quantity: 1,
          },
        ];
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (status !== "authenticated") return;

    try {
      await removeFromCartDB(cartItemId);
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== cartItemId)
      );
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (status !== "authenticated" || quantity < 0) return;

    try {
      if (quantity === 0) {
        await removeFromCart(cartItemId);
        return;
      }

      const updatedItem = await updateCartItemQuantity(cartItemId, quantity);
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: updatedItem.quantity,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      throw error;
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
