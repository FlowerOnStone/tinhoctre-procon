import { columns, Group } from '@/components/group/group';
import { DataTable } from '@/components/table/generaltable';
import Link from 'next/link';
async function getData(): Promise<Group[]> {
    // Fetch data from your API here.
    return [
      {
        id: "1",
        name: "Team One",
        win: 2,
        draw: 0,
        lose: 0,
        difference: 50,
      },
      {
        id: "2",
        name: "Team Two",
        win: 1,
        draw: 0,
        lose: 1,
        difference: 20,
      },
      {
        id: "3",
        name: "Team Three",
        win: 0,
        draw: 0,
        lose: 2,
        difference: -70,
      },
    ]
  }

  export default async function GroupTable() {
    const data = await getData();
    const groupRoute = "/group/"
    return (
    <div>
        <h2 style={{ textAlign: 'center' }}>
        <Link href={groupRoute} style={{fontSize: 24, fontWeight: 'bold'}}>
            Bảng A
        </Link>
        </h2>
        <DataTable data={data} columns={columns} show={false} />
    </div>
    )
  }