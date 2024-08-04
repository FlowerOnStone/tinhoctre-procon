import { DataTable } from '@/components/table/general-table';
import React, { useState, useEffect } from 'react';
import { participantColumns } from './participantColumns';
import groupsApiRequest from '@/api/group';
import { ParticipantResType } from '@/schema/group';
import { toast } from 'react-toastify';

export default function Participants({ id }: { id: string }) {
  const [participants, setParticipants] = useState<ParticipantResType | null>(null);
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const participantRes = await groupsApiRequest.getParticipants(id);
        setParticipants(participantRes);

        // handle response
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch participants');
      }
    };
    fetchRequest();
  }, [id]);

  return <DataTable data={participants?.participants || []} columns={participantColumns} />;
}
