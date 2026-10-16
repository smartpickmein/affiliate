import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches a bearer token to outgoing requests when one is present.
 * Authentication itself is a later phase; today there is no token, so requests
 * pass through unchanged. Kept here so the wiring is ready.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token: string | null = null;
  if (!token) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
