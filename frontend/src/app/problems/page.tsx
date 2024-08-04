'use client';

import problemsApiRequest from '@/api/problem';
import { useAppContext } from '../app-provider';
import Forbidden from '@/components/forbidden';
import { DataTable } from '@/components/table/general-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProblemListResType } from '@/schema/problem';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { problemsColumns } from '@/components/problems/problem-column';

export default function ProblemsPage() {
  const { user } = useAppContext();
  const [problems, setProblems] = useState<ProblemListResType | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const problemsRes = await problemsApiRequest.getProblems();
        setProblems(problemsRes);
      } catch (error: any) {
        toast.error(error.message || 'Có lỗi xảy ra');
      }
    };
    fetchRequest();
  }, []);

  if (!user?.is_admin) {
    return <Forbidden />;
  }

  return (
    <Card className="relative">
      <CardHeader className="p-5 flex flex-row align-middle justify-between border border-b-2 sticky z-20 top-20 bg-white">
        <CardTitle className="my-auto">Danh sách bài toán</CardTitle>
        <Button size={'lg'} className="text-base" type="submit">
          Tạo bài toán
        </Button>
      </CardHeader>
      <CardContent className="mt-5">
        <DataTable data={problems || []} columns={problemsColumns} />
      </CardContent>
    </Card>
  );
}
