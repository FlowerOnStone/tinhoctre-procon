'use client';

import CodeEditorWindow from '@/components/battle/code-editor-window';
import LanguagesDropdown from '@/components/battle/languages-dropdown';
import ThemeDropdown from '@/components/battle/theme-dropdown';
import { Button } from '@/components/ui/button';
import { languageOptions } from '@/lib/languageOptions';
import React, { useState } from 'react';

const javascriptDefault = `/**
* Problem: Binary Search: Search a sorted array for a target value.
*/

// Time: O(log n)
const binarySearch = (arr, target) => {
 return binarySearchHelper(arr, target, 0, arr.length - 1);
};

const binarySearchHelper = (arr, target, start, end) => {
 if (start > end) {
   return false;
 }
 let mid = Math.floor((start + end) / 2);
 if (arr[mid] === target) {
   return mid;
 }
 if (arr[mid] < target) {
   return binarySearchHelper(arr, target, mid + 1, end);
 }
 if (arr[mid] > target) {
   return binarySearchHelper(arr, target, start, mid - 1);
 }
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 5;
console.log(binarySearch(arr, target));
`;

export default function PlayPage() {
  const [code, setCode] = useState(javascriptDefault);
  const [theme, setTheme] = useState('cobalt');
  const [language, setLanguage] = useState(languageOptions[6]);

  const onSelectChange = (sl: any) => {
    console.log('selected Option...', sl);
    setLanguage(sl);
  };

  const onChange = (action: any, data: any) => {
    switch (action) {
      case 'code': {
        setCode(data);
        break;
      }
      default: {
        console.warn('case not handled!', action, data);
      }
    }
  };

  function handleThemeChange(th: any) {
    const theme = th;
    console.log('theme...', theme);

    if (['light', 'vs-dark'].includes(theme.value)) {
      setTheme(theme);
    } else {
      // defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }

  return (
    <div className="mx-auto max-w-screen-2xl w-full">
      <div className="p-10">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Trò chơi đoán số</h1>
          <p className="text-xl">Thời gian còn lại</p>
        </div>

        <p>Đề bài</p>
      </div>

      <div className="w-full bg-stone-300">
        <div className="flex flex-row">
          <div className="px-4 py-2">
            <LanguagesDropdown onSelectChange={onSelectChange} />
          </div>
          <div className="px-4 py-2">
            <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-start px-4 py-4">
          <div className="flex flex-col w-full h-full justify-start items-end">
            <CodeEditorWindow code={code} onChange={onChange} language={language?.value} theme={theme} />
          </div>

          {/* <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                'mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0',
                !code ? 'opacity-50' : ''
              )}
            >
              {processing ? 'Processing...' : 'Compile and Execute'}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div> */}
        </div>
      </div>

      <Button className="mt-4">Submit</Button>
    </div>
  );
}
