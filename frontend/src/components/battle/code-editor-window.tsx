import React, { useState } from 'react';

import Editor from '@monaco-editor/react';

interface CodeEditorWindowProps {
  onChange: (data: string) => void;
  language: string;
  code: string;
  theme: string;
}

const CodeEditorWindow = ({ onChange, language, code, theme }: CodeEditorWindowProps) => {
  const [value, setValue] = useState(code || '');

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setValue(value);
      onChange(value);
    }
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full shadow-4xl">
      <Editor
        height="50vh"
        width={`100%`}
        language={language || 'javascript'}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
