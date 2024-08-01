import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ListProgrammingLanguageType } from '@/schema/common';

interface LanguagesDropdownProps {
  onSelectChange: (l: any) => void;
  programmingLanguages: ListProgrammingLanguageType;
}

const LanguagesDropdown = ({ onSelectChange, programmingLanguages }: LanguagesDropdownProps) => {
  return (
    <Select onValueChange={onSelectChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Filter By Category`} />
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
