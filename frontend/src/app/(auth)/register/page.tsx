import commonApiRequest from '@/api/common';
import Register from './register';

export const metadata = {
  title: 'Register',
  description: 'Register Page',
};

export default async function RegisterPage() {
  const [timezones, programmingLanguages] = await Promise.all([
    commonApiRequest.getListTimezone(),
    commonApiRequest.getListProgrammingLanguage(),
  ]);
  return <Register timezones={timezones} programmingLanguages={programmingLanguages} />;
}
