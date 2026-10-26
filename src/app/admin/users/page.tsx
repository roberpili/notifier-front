import type { Metadata } from "next";
import Link from "next/link";
import { DeleteUserButton } from "@/components/admin/delete_user_button";
import { Button } from "@/components/button";
import { InputComponent } from "@/components/input";
import { StatusMessageComponent } from "@/components/message";
import type { AdminUser } from "@/types/admin";
import {
  getAllUsers,
  getUserByEmail,
  getUserById,
} from "@/services/admin_actions";

export const metadata: Metadata = {
  title: "Notifier | Admin users",
};

type AdminUsersSearchParams = Record<string, string | string[] | undefined>;

const readParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const parseId = (raw: string): number | null => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<AdminUsersSearchParams>;
}) {
  const params = await searchParams;
  const emailQuery = readParam(params.email).trim();
  const idQuery = readParam(params.id).trim();

  let users: AdminUser[] = [];
  let usersError: string | null = null;

  try {
    users = await getAllUsers();
  } catch (error) {
    usersError = errorMessage(error, "error fetching users");
  }

  let selectedUser: AdminUser | null = null;
  let lookupError: string | null = null;
  let lookupLabel: string | null = null;

  if (emailQuery) {
    lookupLabel = `email "${emailQuery}"`;

    try {
      selectedUser = await getUserByEmail(emailQuery);
    } catch (error) {
      lookupError = errorMessage(error, "error fetching user");
    }
  } else if (idQuery) {
    const userId = parseId(idQuery);

    if (userId === null) {
      lookupError = "invalid user ID";
    } else {
      lookupLabel = `ID ${userId}`;

      try {
        selectedUser = await getUserById(userId);
      } catch (error) {
        lookupError = errorMessage(error, "error fetching user");
      }
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Users</h1>
        </div>

        <Link href="/admin/payments" className="admin-link">
          View payments
        </Link>
      </header>

      <section className="admin-card">
        <h2>Find a user</h2>

        <div className="admin-lookup-grid">
          <form method="get" className="admin-form">
            <label htmlFor="user-email">By email</label>
            <div className="admin-inline-controls">
              <InputComponent
                id="user-email"
                name="email"
                type="email"
                placeholder="user@example.com"
                defaultValue={emailQuery}
              />
              <Button type="submit" className="primary-button">
                Search
              </Button>
            </div>
          </form>

          <form method="get" className="admin-form">
            <label htmlFor="user-id">By ID</label>
            <div className="admin-inline-controls">
              <InputComponent
                id="user-id"
                name="id"
                type="number"
                min="1"
                placeholder="123"
                defaultValue={idQuery}
              />
              <Button type="submit" className="primary-button">
                Search
              </Button>
            </div>
          </form>
        </div>

        {lookupError && (
          <StatusMessageComponent message={lookupError} type="error" />
        )}

        {selectedUser && (
          <div className="admin-detail">
            <h3>User found by {lookupLabel}</h3>

            <dl className="admin-details">
              <div>
                <dt>ID</dt>
                <dd>{selectedUser.id}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{selectedUser.name || "-"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{selectedUser.email}</dd>
              </div>
            </dl>

            <DeleteUserButton
              userId={selectedUser.id}
              email={selectedUser.email}
            />
          </div>
        )}

        {!lookupError && (emailQuery || idQuery) && !selectedUser && (
          <StatusMessageComponent message="No user found." type="error" />
        )}
      </section>

      <section className="admin-card">
        <h2>All users</h2>

        {usersError ? (
          <StatusMessageComponent message={usersError} type="error" />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name || "-"}</td>
                      <td>{user.email}</td>
                      <td>{user.role || "-"}</td>
                      <td>
                        <div className="admin-actions">
                          <Link
                            href={`/admin/users?id=${encodeURIComponent(user.id)}`}
                          >
                            View
                          </Link>
                          <DeleteUserButton
                            userId={user.id}
                            email={user.email}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
