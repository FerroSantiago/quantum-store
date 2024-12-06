import { getUsers } from "@/lib/actions/admin/users";
import UsersTable from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Gestión de Usuarios</h2>
      <UsersTable users={users} />
    </div>
  );
}
