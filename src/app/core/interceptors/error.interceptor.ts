import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/** Normalized error shape surfaced to the UI. */
export interface ApiError {
  type: string;
  message: string;
  requestId?: string;
  status: number;
}

/**
 * Translates HTTP failures into the {@link ApiError} shape, unwrapping the
 * backend's error envelope (`{ error: { type, message, request_id } }`) when present.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const envelope = (err.error as { error?: { type?: string; message?: string; request_id?: string } })
        ?.error;
      const apiError: ApiError = {
        type: envelope?.type ?? (err.status === 0 ? 'network_error' : 'http_error'),
        message: envelope?.message ?? err.message ?? 'Something went wrong.',
        requestId: envelope?.request_id,
        status: err.status,
      };
      return throwError(() => apiError);
    }),
  );
