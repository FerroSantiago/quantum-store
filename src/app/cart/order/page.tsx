"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function OrderForm() {
  const { data: session } = useSession();
  const [address, setAddress] = useState("");
  const [billType, setBillType] = useState("A");
  const [file, setFile] = useState<File | null>(null);
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !file || !session?.user?.id) {
      setError("All fields are required");
      return;
    }

    if (!session?.user?.id) {
      setError("Debes iniciar sesión para realizar un pedido.");
      return;
    }

    setIsSubmitting(true);

    //Crear FormData y subir archivo
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", session.user.id.toString());
    formData.append("address", address);
    formData.append("billType", billType);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error uploading file");
      }

      clearCart();
      router.push("/cart/order/confirmation");
    } catch (error) {
      setError("Error uploading file");
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center ">
      <div className="shadow-custom rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Realizar Pedido</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dirección de envío */}
          <div>
            <label className="block font-medium mb-1">Dirección de envío:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={isSubmitting}
              className="bg-transparent w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tipo de facturación */}
          <div>
            <Select value={billType} onValueChange={setBillType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Factura A</SelectItem>
                <SelectItem value="B">Factura B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Archivo de transferencia */}
          <div>
            <label className="block font-medium mb-1">Comprobante de Transferencia:</label>
            <input
              type="file"
              accept=".pdf,.jpeg,.jpg,.png"
              onChange={handleFileChange}
              required
              disabled={isSubmitting}
              className="w-full p-2 border border-border rounded-lg file:bg-secondary file:text-foreground file:py-2 file:px-4 file:rounded-lg file:border-none"
            />
            {file && <p className="text-sm text-gray-600 mt-1">Archivo seleccionado: {file.name}</p>}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary py-2 rounded-lg font-semibold hover:bg-border transition"
          >
            {isSubmitting ? (
              <div className='flex items-center justify-center gap-2'>
                <Loader2 className="animate-spin h-5 w-5" /> Enviando...
              </div>
            ) : (
              "Solicitar Pedido"
            )}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}