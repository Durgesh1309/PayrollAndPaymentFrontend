import { HttpHeaders } from '@angular/common/http';

export function authHeaders(): HttpHeaders {
  const token = localStorage.getItem('jwtToken'); // matches AuthService
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  if (token) headers = headers.set('Authorization', `Bearer ${token}`);
  return headers;
}
