import http from '@/lib/http';
import { DetailGroupResType, ListGroupResType } from '@/schema/group';

const groupsApiRequest = {
  getListGroups: (id: string) => http.get<ListGroupResType>(`/api/tournament/${id}/group/`),
  getDetailGroup: (id: string) => http.get<DetailGroupResType>(`/api/group/${id}/`),
};

export default groupsApiRequest;
