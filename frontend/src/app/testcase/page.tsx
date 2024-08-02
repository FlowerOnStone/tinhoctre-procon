import { DataTable } from '@/components/table/generaltable';
import { columnsTestCase, TestCase } from '@/components/testcase/testcase';
import TestCaseEditor from '@/components/testcase/testcaseeditor';
import { Button } from '@/components/ui/button';
import React from 'react';

async function getTestCaseData(): Promise<TestCase[]> {
  return [
    {
      id: '1',
      grader: 'Grader Alpha',
      ioMethod: 'Method A',
      marker: 'Marker X',
      outputLimit: '10 MB',
    },
    {
      id: '2',
      grader: 'Grader Beta',
      ioMethod: 'Method B',
      marker: 'Marker Y',
      outputLimit: '15 MB',
    },
    {
      id: '3',
      grader: 'Grader Gamma',
      ioMethod: 'Method C',
      marker: 'Marker Z',
      outputLimit: '12 MB',
    },
    {
      id: '4',
      grader: 'Grader Delta',
      ioMethod: 'Method D',
      marker: 'Marker W',
      outputLimit: '8 MB',
    },
    {
      id: '5',
      grader: 'Grader Epsilon',
      ioMethod: 'Method E',
      marker: 'Marker V',
      outputLimit: '20 MB',
    },
  ];
}

export default async function TestCasePage() {
  const data = await getTestCaseData();
  return (
    <div style={{margin: '0px 50px'}}>
      <div className="mx-auto max-w-screen-2xl w-full mb-6">
        <h1 className="text-3xl mb-4 mt-8 font-bold">Quản lý Test Case</h1>
        <TestCaseEditor />
        <Button variant={'login'} className="mt-4 mb-10 rounded-none">
          Thêm
        </Button>

        <DataTable data={data} columns={columnsTestCase}></DataTable>

        <Button variant={'login'} className="mt-4 mb-10 rounded-none">
          Áp dụng
        </Button>
      </div>
    </div>
  );
}
