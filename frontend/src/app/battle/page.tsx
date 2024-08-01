import React from 'react';
import Play from './battle';
import commonApiRequest from '@/api/common';

export default async function PlayPage() {
  const programmingLanguages = await commonApiRequest.getListProgrammingLanguage();
  return <Play programmingLanguages={programmingLanguages} />;
}
