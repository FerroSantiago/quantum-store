"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 8000);

    return () => { clearTimeout(timer); };
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center p-6">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold">Solicitud enviada</h1>
      <p className="text-gray-600 mt-2">
        Tu solicitud ha sido enviada y está pendiente de revisión.
      </p>
      <p className="text-gray-500 mt-1">Serás redirigido en unos segundos...</p>
    </div>
  );
}