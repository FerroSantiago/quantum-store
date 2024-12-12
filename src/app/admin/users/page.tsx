import { getUsers } from "@/lib/actions/admin/users";
import UsersTable from "@/components/admin/UsersTable";
import SearchInput from "@/components/admin/SearchInput";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <PageHeader title="Gestión de Usuarios">
        <SearchInput placeholder="Buscar por email o nombre..." />
      </PageHeader>
      <UsersTable users={users} />
    </div>
  );
}
