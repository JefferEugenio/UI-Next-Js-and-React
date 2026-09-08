"use client";

import { useEffect, useState } from "react";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await readResponse(response);
        if (!response.ok)
          throw new Error(data.error || "Could not load users.");
        setUsers(data.users);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  async function updateRole(userId, role) {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    const data = await readResponse(response);
    if (!response.ok)
      throw new Error(data.error || "Could not update user role.");
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === userId ? data.user : user)),
    );
  }

  return { users, isLoading, error, updateRole };
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {
      error: `The server returned an invalid response (${response.status}).`,
    };
  }
}
