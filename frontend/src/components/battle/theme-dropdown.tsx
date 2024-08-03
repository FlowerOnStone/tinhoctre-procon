import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import monacoThemes from 'monaco-themes/themes/themelist.json';

interface ThemeDropdownProps {
  handleThemeChange: (theme: any) => void;
  theme: string;
}

const ThemeDropdown = ({ handleThemeChange, theme }: ThemeDropdownProps) => {
  return (
    <Select onValueChange={handleThemeChange} defaultValue={theme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Select Theme`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(monacoThemes).map(([themeId, themeName]) => (
            <SelectItem key={themeId} value={themeId}>
              {themeName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ThemeDropdown;
