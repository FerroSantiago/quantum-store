"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function OrderForm() {
  const { data: session } = useSession();
  const [address, setAddress] = useState("");
  const [billType, setBillType] = useState("A");
  const [file, setFile] = useState<File | null>(null);
  const [amountPaid, setAmountPaid] = useState<string>(""); // Nuevo campo
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type");
        setFile(null);
      } else {
        setError("");
        setFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !file || !amountPaid || !session?.user?.id) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (isNaN(parseFloat(amountPaid)) || parseFloat(amountPaid) <= 0) {
      setError("Ingrese un monto válido");
      return;
    }

    setIsSubmitting(true);

    // Crear FormData y subir archivo
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", session.user.id.toString());
    formData.append("address", address);
    formData.append("billType", billType);
    formData.append("amountPaid", amountPaid); // Nuevo campo

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al subir el archivo");
      }

      clearCart();
      router.push("/cart/order/confirmation");
    } catch (error) {
      setError("Error al subir el archivo");
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dirección de Envío
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Facturación
        </label>
        <Select onValueChange={setBillType} defaultValue={billType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo de facturación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Factura A</SelectItem>
            <SelectItem value="B">Factura B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Monto Pagado
        </label>
        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comprobante de Pago
        </label>
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Enviar Pedido"
        )}
      </button>
    </form>
  );
}
