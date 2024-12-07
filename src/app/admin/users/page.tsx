import { getUsers } from "@/lib/actions/admin/users";
import UsersTable from "@/components/admin/UsersTable";
import UserSearch from "@/components/admin/UserSearch";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Gestión de Usuarios</h2>
        <div className="flex justify-between items-center">
          <UserSearch />
        </div>
        <UsersTable users={users} />
      </div>
    </div>
  );
}
