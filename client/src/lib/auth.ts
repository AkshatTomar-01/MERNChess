export function getToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeToken(): void {
  localStorage.removeItem('authToken');
}

export function getCurrentUserId(): string | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

export function getCurrentUsername(): string | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
