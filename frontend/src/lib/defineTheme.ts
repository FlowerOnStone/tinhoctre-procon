import { loader } from '@monaco-editor/react';
import monacoThemes from 'monaco-themes/themes/themelist.json';

const defineTheme = (theme: string) => {
  return new Promise<void>((res) => {
    const key = theme as keyof typeof monacoThemes;
    return Promise.all([loader.init(), import(`monaco-themes/themes/${monacoThemes[key]}.json`)]).then(
      ([monaco, themeData]) => {
        monaco.editor.defineTheme(theme, themeData);
        res();
      }
    );
  });
};

export { defineTheme };
