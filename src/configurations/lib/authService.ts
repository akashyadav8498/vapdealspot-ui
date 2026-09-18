export type UserRole = "user" | "admin" | "super_admin";

/**
 * Mock user credentials for frontend development.
 * Replace with real API authentication when backend is ready.
 */
const MOCK_USERS: Record<string, { password: string; role: UserRole }> = {
  "user@vapedealspot.com":       { password: "user123",       role: "user" },
  "admin@vapedealspot.com":      { password: "admin123",      role: "admin" },
  "superadmin@vapedealspot.com": { password: "superadmin123", role: "super_admin" },
};

/** Currently logged-in user role (set after login) */
let currentUserRole: UserRole | null = (localStorage.getItem('vds_role') as UserRole) || null;

/**
 * Returns the current user role.
 */
export function getCurrentRole(): UserRole {
  return currentUserRole ?? "user";
}

/**
 * Returns the redirect path after successful login based on user role.
 */
export function getPostLoginRedirect(role: UserRole): string {
  if (role === "admin" || role === "super_admin") {
    return "/admin";
  }
  return "/catalog";
}

/**
 * Mock login handler — validates against MOCK_USERS.
 * Replace with real API call when backend is ready.
 */
export async function handleLogin(email: string, password: string): Promise<UserRole> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = MOCK_USERS[email.toLowerCase()];
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  currentUserRole = user.role;
  localStorage.setItem('vds_role', user.role);
  return user.role;
}

/**
 * Placeholder logout handler.
 * Replace with real logout logic when backend is ready.
 */
export async function handleLogout(): Promise<void> {
  currentUserRole = null;
  localStorage.removeItem('vds_role');
}
