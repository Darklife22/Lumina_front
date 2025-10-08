// src/app/core/api.interceptor.ts  (lee el token guardado; sin pedir rol)
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from './env';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsolute = /^https?:\/\//i.test(req.url);
  const url = isAbsolute ? req.url : `${environment.apiBaseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  const token = localStorage.getItem('token') || (localStorage.getItem('auth_user') ? (JSON.parse(localStorage.getItem('auth_user')!)?.token ?? '') : '');
  const cloned = req.clone({
    url,
    setHeaders: {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  return next(cloned);
};
