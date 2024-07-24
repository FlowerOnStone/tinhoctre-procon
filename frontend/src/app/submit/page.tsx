import { DataTable } from '@/components/table/generaltable';
import { submitColumns, Submit } from '@/components/submit/submitColumns';
import React from 'react';

async function getTestCaseData(): Promise<Submit[]> {
  return [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      grade: '10',
      time: '1h 30p',
    },
    {
      id: '2',
      name: 'Nguyễn Văn B',
      grade: '9',
      time: '1h 40p',
    },
    {
      id: '3',
      name: 'Nguyễn Văn C',
      grade: '8',
      time: '1h 50p',
    },
    {
      id: '4',
      name: 'Nguyễn Văn D',
      grade: '7',
      time: '2h 00p',
    },
  ];
}

const ListItem = ({ text, active }: any) => (
  <div className={`p-2.5 border-b border-gray-300 last:border-b-0 ${active ? 'bg-blue-500 text-white' : ''}`}>
    {text}
  </div>
);

export default async function SubmitPage() {
  const data = await getTestCaseData();
  const items = [
    { id: 1, text: 'Bài 1: Đoán số', active: true },
    { id: 2, text: 'Bài 2: Bài toán phụ', active: false },
    { id: 3, text: 'Bài 3: Bài toán phụ', active: false },
    { id: 4, text: 'Bài 4: Bài toán phụ', active: false },
  ];
  return (
    <div className="mx-auto max-w-screen-2xl w-full mb-6">
      <h1 className="text-3xl mb-4 mt-8 font-bold">Quản lý bài nộp</h1>
      <div className="flex gap-10">
        <div className="flex-[7]">
          <DataTable data={data} columns={submitColumns}></DataTable>
        </div>
        <div className="max-w-md mx-auto my-10 flex-[3]">
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-gray-100 p-2.5 font-bold border-b border-gray-300">Danh sách</div>
            {items.map((item) => (
              <ListItem key={item.id} text={item.text} active={item.active} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
