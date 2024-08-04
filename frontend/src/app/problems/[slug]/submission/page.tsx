'use client';

import submitApiRequest from '@/api/submission';
import { submitColumns } from '@/components/submit/submitColumns';
import { DataTable } from '@/components/table/general-table';
import { ListSubmissionRes } from '@/schema/submission';
import { useEffect, useState } from 'react';

export default function SubmissionPage({ params }: { params: { slug: string } }) {
  const [submissions, setSubmissions] = useState<ListSubmissionRes>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await submitApiRequest.getProblemSubmission(params.slug);
      setSubmissions(response);
    };

    fetchSubmissions();
  }, [params.slug]);

  return (
    <>
      <h1 className="text-3xl mb-4 mt-8 font-bold">Quản lý bài nộp</h1>
      <div className="flex gap-10">
        <div className="flex-[7]">
          <DataTable data={submissions} columns={submitColumns}></DataTable>
        </div>
      </div>
    </>
  );
}
