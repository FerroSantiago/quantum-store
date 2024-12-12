"use client";

import { useState } from "react";
import { User, UserStatus } from "@prisma/client";
import { updateUserStatus } from "@/lib/actions/admin/users";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Table } from "./Table";
import { StatusBadge } from "./StatusBadage";

type UserTableItem = Pick<
  User,
  "id" | "email" | "name" | "role" | "status" | "createdAt"
>;

export default function UsersTable({ users }: { users: UserTableItem[] }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

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

  const columns = [
    {
      key: "email",
      header: "Email",
      cell: (user: UserTableItem) => user.email,
    },
    {
      key: "name",
      header: "Nombre",
      cell: (user: UserTableItem) => user.name || "-",
    },
    {
      key: "status",
      header: "Estado",
      cell: (user: UserTableItem) => (
        <StatusBadge
          variant={
            user.status === UserStatus.PENDING
              ? "warning"
              : user.status === UserStatus.APPROVED
              ? "success"
              : "error"
          }
        >
          {user.status === UserStatus.PENDING
            ? "Pendiente"
            : user.status === UserStatus.APPROVED
            ? "Aprobado"
            : "Rechazado"}
        </StatusBadge>
      ),
    },
    {
      key: "role",
      header: "Rol",
      cell: (user: UserTableItem) => user.role,
    },
    {
      key: "actions",
      header: "",
      cell: (user: UserTableItem) => (
        <div className="flex justify-end gap-2">
          {user.status !== UserStatus.APPROVED && (
            <button
              onClick={() => handleStatusUpdate(user.id, UserStatus.APPROVED)}
              disabled={isLoading === user.id}
              className="p-2 hover:bg-green-50 text-green-600 rounded-md"
              title="Aprobar usuario"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {user.status !== UserStatus.REJECTED && (
            <button
              onClick={() => handleStatusUpdate(user.id, UserStatus.REJECTED)}
              disabled={isLoading === user.id}
              className="p-2 hover:bg-red-50 text-red-500 rounded-md"
              title="Rechazar usuario"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={users}
      columns={columns}
      searchField={(user) => `${user.email} ${user.name || ""}`}
    />
  );
}
