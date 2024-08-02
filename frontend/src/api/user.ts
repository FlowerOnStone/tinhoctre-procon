import http from '@/lib/http';
import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType } from '@/schema/user';

const userApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/api/login/', body),
  register: (body: RegisterBodyType) => http.post<RegisterResType>('/auth/register', body),
  auth: (body: { token: string }) =>
    http.post('/api/auth', body, {
      baseUrl: '',
    }),

  logout: () => http.post('/api/logout/', {}),
};

export default userApiRequest;
