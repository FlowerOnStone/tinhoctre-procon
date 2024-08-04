import { DataTable } from '@/components/table/general-table';
import React, {useState, useEffect} from 'react';
import { participantColumns } from './participantColumns';
import groupsApiRequest from '@/api/group';
import { ParticipantResType } from '@/schema/group';

export default function Participants({ id }: { id: string }) {
  const [participants, setParticipants] = useState< ParticipantResType| null>(null)
  useEffect(()=>{
    const fetchRequest = async () => {
      try {
        const participantRes = await groupsApiRequest.getParticipants(id);
        setParticipants(participantRes)
        
        // handle response
      } catch (error) {
        alert('Failed to fetch participants');
      }
    }
    fetchRequest();
  }, [id])

  return <DataTable showPagination showSearch showColumnVisibility data={participants?.participants || []} columns={participantColumns} />;

}
