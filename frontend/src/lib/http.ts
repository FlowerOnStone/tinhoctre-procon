import { LoginResType } from '@/schema/user';
import { normalizePath } from './utils';

const AUTHENTICATION_ERROR_STATUS = 401;

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined;
};

export const isClient = () => typeof window !== 'undefined';

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options?.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        };
  if (isClient()) {
    const token = localStorage.getItem('token');
    if (token !== 'undefined' && token !== undefined && token != null) {
      baseHeaders.Authorization = `token ${token}`;
    }
  }

  const baseUrl = options?.baseUrl === undefined ? process.env.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  const contentType = res.headers.get('Content-Type');
  let data: Response;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = (await res.text()) as unknown as Response;
  }

  // Interceptor
  if (!res.ok) {
    if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // logout
    }
  }

  if (isClient()) {
    if (['api/login/', 'api/register/'].some((item) => item === normalizePath(url))) {
      const { token } = data as LoginResType;
      localStorage.setItem('token', token);
    } else if ('api/logout/' === normalizePath(url)) {
      localStorage.removeItem('token');
      // localStorage.removeItem('user');
    }
  }

  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options);
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options });
  },
};

export default http;
