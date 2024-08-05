import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { UserListResType } from '@/schema/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface UserFormFieldProps {
  flattenGroups: number[];
  participants: UserListResType;
  nestIndex: number;
  control: any;
  register: any;
  setValue: any;
  getValues: any;
}

export default function UserFormField({
  flattenGroups,
  participants,
  nestIndex,
  control,
  setValue,
  getValues,
  register,
}: UserFormFieldProps) {
  const { fields, append } = useFieldArray({
    control,
    name: `groups.${nestIndex}`,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append([0, 0, 0]);
    }
  }, [fields.length, append]);

  return (
    <div className="flex flex-col gap-2">
      {fields.map((item, k) => {
        function onChange(value: string) {
          const newGroups = getValues(`groups`);
          newGroups[nestIndex][k] = parseInt(value);
          console.log(newGroups);

          setValue(`groups`, newGroups);
        }

        const defaultValues = getValues(`groups.${nestIndex}.${k}`);

        return (
          <div key={item.id} className="min-w-60">
            <Select onValueChange={onChange} defaultValue={defaultValues.toString()}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => {
                  const isDisabled = flattenGroups.includes(participant.id);
                  return (
                    <SelectItem key={participant.id} value={participant.id.toString()} disabled={isDisabled}>
                      {participant.username}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}
