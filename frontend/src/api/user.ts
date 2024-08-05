import http from '@/lib/http';
import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType, UserListResType } from '@/schema/user';

const userApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/api/login/', body),
  register: (body: RegisterBodyType) => http.post<RegisterResType>('/api/register/', body),
  logout: () => http.post<{}>('/api/logout/', {}),
  auth: (body: { token: string }) =>
    http.post('/api/auth', body, {
      baseUrl: '',
    }),
  getListUser: () => http.get<UserListResType>('/api/user/list/'),
};

export default userApiRequest;
