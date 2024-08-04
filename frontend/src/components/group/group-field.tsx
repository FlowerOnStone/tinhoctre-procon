import React, { useEffect, useState } from 'react';
import UserFormField from './user-field';
import { UserListResType } from '@/schema/user';
import { toast } from 'react-toastify';
import { nameGroup } from '@/lib/const';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import groupsApiRequest from '@/api/group';
import { flattenArrays } from '@/lib/utils';

interface GroupFormFieldProps {
  id: string;
  control: any;
  setValue: any;
  getValues: any;
  register: any;
  groupsWatch: number[][];
}

export default function GroupFormField({
  id,
  control,
  setValue,
  getValues,
  register,
  groupsWatch,
}: GroupFormFieldProps) {
  const [participants, setParticipants] = useState<UserListResType>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const participantRes = await groupsApiRequest.getParticipants(id);
        setParticipants(participantRes.participants);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch participants');
      }
    };
    fetchRequest();
  }, []);

  const flattenGroups = flattenArrays(groupsWatch);

  return (
    <div className="flex flex-col gap-5 w-full px-12">
      {[0, 1].map((item) => (
        <div className="mt-5 flex w-full justify-around gap-10" key={item}>
          {[0, 1, 2, 3].map((item2) => (
            <Card className="">
              <CardHeader className="p-4 flex items-center">
                <CardTitle className="text-base">Bảng {nameGroup[item * 4 + item2]}</CardTitle>
              </CardHeader>
              <CardContent>
                <UserFormField
                  flattenGroups={flattenGroups}
                  participants={participants}
                  nestIndex={item * 4 + item2}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                  register={register}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
