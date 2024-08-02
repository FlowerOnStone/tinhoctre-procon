'use client';
import ProblemEditor from '@/components/editor/problemeditor';
import { columns, Group } from '@/components/group/group';
import { DataTable } from '@/components/table/generaltable';
import InteractiveLink from './interactivelink';

function getData(): Group[] {
  // Fetch data from your API here.
  return [
    {
      id: '1',
      name: 'Team One',
      win: 2,
      draw: 0,
      lose: 0,
      difference: 50,
    },
    {
      id: '2',
      name: 'Team Two',
      win: 1,
      draw: 0,
      lose: 1,
      difference: 20,
    },
    {
      id: '3',
      name: 'Team Three',
      win: 0,
      draw: 0,
      lose: 2,
      difference: -70,
    },
  ];
}

export default function GeneralTournamentPage() {
  const data = getData();
  const groupRoute = '/group/';
  return (
    <div className="mx-auto max-w-screen-2xl w-full mb-6">
      <h1 className="text-3xl mb-4 mt-8 font-bold">Vòng bảng</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '5%' }}>
        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng A</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>

        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng B</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '5%' }}>
        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng A</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>

        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng B</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '5%' }}>
        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng A</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>

        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng B</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '5%' }}>
        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng A</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>

        <div style={{ width: '47.5%' }}>
          <h2 style={{ textAlign: 'center' }}>
            <InteractiveLink href={groupRoute}>Bảng B</InteractiveLink>
          </h2>
          <DataTable data={data} columns={columns} show={false} />
        </div>
      </div>
    </div>
  );
}
