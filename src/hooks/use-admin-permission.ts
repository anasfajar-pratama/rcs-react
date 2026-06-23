export function useAdminPermission() {
  const raw = localStorage.getItem('admin_permissions')
  const permissions: string[] = raw ? JSON.parse(raw) : []

  return {
    permissions,
    hasPermission: (slug: string) => permissions.includes(slug),
    hasAnyPermission: (slugs: string[]) => slugs.some((s) => permissions.includes(s)),
    hasAllPermissions: (slugs: string[]) => slugs.every((s) => permissions.includes(s)),
  }
}
