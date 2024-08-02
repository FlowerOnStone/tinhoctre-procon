import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ListProgrammingLanguageType } from '@/schema/common';

interface LanguagesDropdownProps {
  onSelectChange: (l: any) => void;
  programmingLanguages: ListProgrammingLanguageType;
}

const LanguagesDropdown = ({ onSelectChange, programmingLanguages }: LanguagesDropdownProps) => {
  return (
    <Select onValueChange={onSelectChange} defaultValue={programmingLanguages[0].id.toString()}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {programmingLanguages.map((language) => (
            <SelectItem key={language.id} value={language.id.toString()}>
              {language.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguagesDropdown;
