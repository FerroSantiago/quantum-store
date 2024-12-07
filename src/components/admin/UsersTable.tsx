"use client";

import { useState, useMemo } from "react";
import { User, UserStatus } from "@prisma/client";
import { updateUserStatus } from "@/lib/actions/admin/users";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

type UserTableItem = Pick<
  User,
  "id" | "email" | "name" | "role" | "status" | "createdAt"
>;

export default function UsersTable({ users }: { users: UserTableItem[] }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase();

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm) ||
        (user.name?.toLowerCase() || "").includes(searchTerm)
    );
  }, [users, searchTerm]);

  const handleStatusUpdate = async (userId: string, status: UserStatus) => {
    setIsLoading(userId);
    try {
      await updateUserStatus(userId, status);
      toast.success(
        `Usuario ${
          status === UserStatus.APPROVED ? "aprobado" : "rechazado"
        } correctamente`
      );
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Error al actualizar estado");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      {filteredUsers.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">
          {searchTerm
            ? "No se encontraron usuarios que coincidan con la búsqueda"
            : "No hay usuarios registrados"}
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Rol</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-muted/50">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.name || "-"}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${
                    user.status === UserStatus.PENDING
                      ? "bg-yellow-100 text-yellow-800"
                      : user.status === UserStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  >
                    {user.status === UserStatus.PENDING
                      ? "Pendiente"
                      : user.status === UserStatus.APPROVED
                      ? "Aprobado"
                      : "Rechazado"}
                  </span>
                </td>
                <td className="p-4">{user.role}</td>
                <td className="p-4 text-right">
                  {user.status === UserStatus.PENDING && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(user.id, UserStatus.APPROVED)
                        }
                        disabled={isLoading === user.id}
                        className="p-2 hover:bg-green-50 text-green-600 rounded-md"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(user.id, UserStatus.REJECTED)
                        }
                        disabled={isLoading === user.id}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
