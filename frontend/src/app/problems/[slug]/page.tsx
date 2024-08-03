import React from 'react';
import commonApiRequest from '@/api/common';
import ProblemDetail from './problem';

export default async function ProblemDetailPage({ params }: { params: { slug: string } }) {
  const programmingLanguages = await commonApiRequest.getListProgrammingLanguage();
  return <ProblemDetail programmingLanguages={programmingLanguages} slug={params.slug} />;
}
