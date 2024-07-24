import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import monacoThemes from 'monaco-themes/themes/themelist.json';
// import { customStyles } from "../constants/customStyles";

const ThemeDropdown = ({ handleThemeChange, theme }: any) => {
  return (
    <Select onValueChange={handleThemeChange} defaultValue={theme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Select Theme`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(monacoThemes).map(([themeId, themeName]) => (
            <SelectItem key={themeId} value={themeId}>
              {/* {themeName} */}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>

    // <Select

    //   // options={languageOptions}
    //   options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
    //     label: themeName,
    //     value: themeId,
    //     key: themeId,
    //   }))}
    //   value={theme}
    //   styles={customStyles}
    //   onChange={handleThemeChange}
    // />
  );
};

export default ThemeDropdown;
