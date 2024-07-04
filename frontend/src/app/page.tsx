import Header from '@/components/header';
import Image from 'next/image';
import {ScoreBoard} from '@/components/scoreboard/scoreboard';
import { Payment, columns } from '@/components/scoreboard/column';
import { DataTable } from '@/components/scoreboard/data-table';
import StatusBar from '@/components/statusBar/StatusBar'
 
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}
export default async function Home() {
  const data = await getData()
  return (
    <div>
      <StatusBar/>
    </div>
  );
}
