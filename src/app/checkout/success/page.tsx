"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";

interface PaymentDetails {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  payment_id?: string;
  order: {
    id: string;
    total: number;
    items: Array<{
      product: {
        name: string;
        price: number;
      };
      quantity: number;
    }>;
  };
}

interface OrderDetails {
  payment_id: string;
  external_reference: string;
  status: string | undefined;
  paymentDetails?: PaymentDetails;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLLS = 5;
  const POLL_INTERVAL = 1000;

  // Efecto separado para el script de MP
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.type = "text/javascript";
    let scriptAdded = false;

    if (
      !document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]')
    ) {
      document.body.appendChild(script);
      scriptAdded = true;
    }

    return () => {
      if (scriptAdded && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const checkPaymentStatus = useCallback(async () => {
    console.log("Checking payment status...");
    const payment_id = searchParams.get("payment_id");
    const status = searchParams.get("status") || undefined;
    const external_reference = searchParams.get("external_reference");

    console.log("Payment params:", {
      payment_id,
      status,
      external_reference,
    });

    if (!payment_id || !external_reference) {
      console.log("Missing payment information");
      setError("Información de pago incompleta");
      setIsLoading(false);
      return null;
    }

    try {
      console.log("Fetching payment details...");
      const response = await fetch(`/api/payments/${external_reference}`);
      const data = await response.json();

      console.log("Payment details response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Error al obtener los detalles del pago");
      }

      const orderDetails = {
        payment_id,
        external_reference,
        status,
        paymentDetails: data,
      };

      setOrderDetails(orderDetails);
      return data.status;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, setError, setIsLoading, setOrderDetails]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const startPolling = async () => {
      const status = await checkPaymentStatus();

      if (status === "PENDING" && pollCount < MAX_POLLS) {
        pollInterval = setTimeout(() => {
          setPollCount((count) => count + 1);
        }, POLL_INTERVAL);
      }
    };

    startPolling();

    return () => {
      if (pollInterval) {
        clearTimeout(pollInterval);
      }
    };
  }, [checkPaymentStatus, pollCount, MAX_POLLS]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto p-6">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <p>Verificando el estado de tu pago...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <Link
              href="/"
              className="block w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto p-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            {orderDetails?.paymentDetails?.status === "APPROVED"
              ? "¡Pago Exitoso!"
              : "Procesando Pago..."}
          </h1>
          <p className="text-gray-600 mb-6">
            {orderDetails?.paymentDetails?.status === "APPROVED"
              ? "Tu orden ha sido procesada correctamente."
              : "Estamos verificando tu pago..."}
          </p>

          {orderDetails?.paymentDetails && (
            <div className="text-left bg-gray-50 p-4 rounded-md mb-6 space-y-4">
              <div>
                <p className="mb-2">
                  <span className="font-semibold">ID de Pago:</span>{" "}
                  {orderDetails.payment_id}
                </p>
                <p>
                  <span className="font-semibold">Referencia:</span>{" "}
                  {orderDetails.external_reference}
                </p>
              </div>

              {orderDetails.paymentDetails.order?.items && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Detalles de la orden:</h3>
                  {orderDetails.paymentDetails.order.items.map(
                    (item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} x{item.quantity}
                        </span>
                        <span>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    )
                  )}
                  <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
                    <span>Total</span>
                    <span>
                      ${orderDetails.paymentDetails.order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Link
              href="/profile/orders"
              className="block w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
            >
              Ver mis órdenes
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
