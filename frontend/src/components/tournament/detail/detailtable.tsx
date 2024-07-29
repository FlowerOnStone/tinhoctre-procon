
import { ScoreTable } from './scoretable';
import GroupTable from './grouptable';


  export default async function DetailTable() {
    return (
    <div style={{margin: '0% 10%'}}>
        <h1 className="text-3xl mb-4 mt-8 font-bold">Chi tiết bảng A</h1>
        <div style={{margin: '5% 20% 10%'}}>
            <ScoreTable></ScoreTable>
        </div>
        <div style={{margin: '5% 0% 10%'}}>
            <GroupTable></GroupTable>
        </div>    
    </div>
    )
  }