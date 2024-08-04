import http from '@/lib/http';
import { DetailGroupResType, ListGroupResType, ParticipantResType } from '@/schema/group';

const groupsApiRequest = {
  getListGroups: (id: string) => http.get<ListGroupResType>(`/api/tournament/${id}/group/`),
  getDetailGroup: (id: string) => http.get<DetailGroupResType>(`/api/group/${id}/`),
  getParticipants: (id: string) => http.get<ParticipantResType>(`/api/tournament/${id}/participants/`),
};

export default groupsApiRequest;
