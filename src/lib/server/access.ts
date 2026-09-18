export function isOwner(email: unknown, owners: unknown): boolean {
  if (typeof email !== 'string' || typeof owners !== 'string') return false;
  const address = email.trim().toLowerCase();
  if (!address) return false;
  return owners.split(/[,\s]+/).filter(Boolean).some(owner => owner.toLowerCase() === address);
}
export function isPrivatePath(path: string) {
  return path === '/admin' || path.startsWith('/admin/') || path === '/auth' || path.startsWith('/auth/');
}
