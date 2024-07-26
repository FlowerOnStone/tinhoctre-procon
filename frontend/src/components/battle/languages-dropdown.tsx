import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { languageOptions } from '@/lib/languageOptions';

const LanguagesDropdown = ({ onSelectChange }: { onSelectChange: (l: any) => void }) => {
  return (
    <Select onValueChange={onSelectChange} defaultValue={languageOptions[6].name}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Filter By Category`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languageOptions.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguagesDropdown;
