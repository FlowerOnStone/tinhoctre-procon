import http from '@/lib/http';
import { ListProgrammingLanguageType, ListTimezoneType } from '@/schema/common';

const commonApiRequest = {
  getListTimezone: () => http.get<ListTimezoneType>('/api/timezone/'),
  getListProgrammingLanguage: () => http.get<ListProgrammingLanguageType>('/api/programlanguage/'),
};

export default commonApiRequest;
