"use client";

import useUsers from "../../hooks/useUsers";

export default function UserManager({ currentUserId }) {
  const { users, isLoading, error, updateRole } = useUsers();

  async function handleRoleChange(userId, role) {
    try {
      await updateRole(userId, role);
    } catch (roleError) {
      window.alert(roleError.message);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="border-b border-line pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">Administration</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Users</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted">Manage who can administer the workspace and who can view and manage their own work.</p>
      </section>

      {error && <p className="mt-6 text-sm text-terracotta" role="alert">{error}</p>}
      <section className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
        {isLoading && <p className="px-5 py-8 text-sm text-muted">Loading users...</p>}
        {!isLoading && users.length === 0 && <p className="px-5 py-8 text-sm text-muted">No users found.</p>}
        {!isLoading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 font-semibold text-ink">{user.name}{user.id === currentUserId && <span className="ml-2 text-xs font-normal text-muted">(you)</span>}</td>
                    <td className="px-5 py-5 text-sm text-body">{user.email}</td>
                    <td className="px-5 py-5">
                      <label htmlFor={`role-${user.id}`} className="sr-only">Role for {user.name}</label>
                      <select id={`role-${user.id}`} value={user.role} onChange={(event) => handleRoleChange(user.id, event.target.value)} className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-terracotta">
                        <option value="VIEWER">Viewer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
