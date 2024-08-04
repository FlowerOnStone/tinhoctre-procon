'use client';
import problemsApiRequest from '@/api/problem';
import submitApiRequest from '@/api/submission';
import { useAppContext } from '@/app/app-provider';
import CodeEditorWindow from '@/components/battle/code-editor-window';
import LanguagesDropdown from '@/components/battle/languages-dropdown';
import ThemeDropdown from '@/components/battle/theme-dropdown';
import Timer from '@/components/battle/timer';
import { Button } from '@/components/ui/button';
import { javascriptDefault } from '@/lib/const';
import { defineTheme } from '@/lib/defineTheme';
import { calculateTimeInSeconds } from '@/lib/utils';
import { ListProgrammingLanguageType } from '@/schema/common';
import { ProblemType } from '@/schema/problem';
import { Check, Clock4, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Params {
  slug: string;
  programmingLanguages: ListProgrammingLanguageType;
}

export default function ProblemDetail({ slug, programmingLanguages }: Params) {
  const { user } = useAppContext();

  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [code, setCode] = useState(javascriptDefault);
  const [theme, setTheme] = useState('cobalt');
  const [language, setLanguage] = useState(user?.preferred_language.name || 'C++ 11');

  const onSelectChange = (sl: string) => {
    console.log('selected Option...', sl);
    setLanguage(sl);
  };

  function handleThemeChange(theme: string) {
    if (['light', 'vs-dark'].includes(theme)) {
      setTheme(theme);
    } else {
      defineTheme(theme).then((_) => setTheme(theme));
    }
  }

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const problemRes = await problemsApiRequest.getDetailProblem(slug);
        setProblem(problemRes.problem);
      } catch (error) {
        alert('Failed to fetch tournament detail');
      }
    };
    fetchRequest();
  }, [slug]);

  function handleSubmit() {
    const languageId = programmingLanguages.find((lang) => lang.name === language)?.id || 2;
    try {
      const res = submitApiRequest.submitCode(slug, {
        source: code,
        language: languageId,
      });
      toast.success('Submit successfully');
    } catch (error: any) {
      toast.error('Submit failed');
    }
  }

  return (
    <>
      <div className="pb-4">
        <div className="flex justify-between py-3">
          <h1 className="text-3xl font-bold">{problem?.name}</h1>
          {localStorage.getItem('startTournament') !== null && localStorage.getItem('endTournament') !== null ? (
            <Timer
              initialTime={calculateTimeInSeconds(
                localStorage.getItem('startTournament'),
                localStorage.getItem('endTournament')
              )}
            />
          ) : (
            <></>
          )}
        </div>
        <div>
          <div className="bg-[#fff6dd] p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-4 w-full">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Points: 100 (p)</span>
            </div>
            <div className="flex items-center">
              <Clock4 className="w-5 h-5 text-gray-600 mr-2" />
              <span>Time limit: {problem?.time_limit}ms</span>
            </div>
            <div className="flex items-center">
              <Cpu className="w-5 h-5 text-gray-600 mr-2" />
              <span>Memory limit: {problem?.memory_limit}MB</span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold">Problem Description</h2>
            <div className="mt-2">{problem?.body}</div>
          </div>
        </div>
      </div>

      <div className="w-full bg-stone-300">
        <div className="flex flex-row">
          <div className="px-4 py-2">
            <LanguagesDropdown onSelectChange={onSelectChange} programmingLanguages={programmingLanguages} />
          </div>
          <div className="px-4 py-2">
            <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-start px-4 py-4">
          <div className="flex flex-col w-full h-full justify-start items-end">
            <CodeEditorWindow code={code} onChange={setCode} language={language} theme={theme} />
          </div>
        </div>
      </div>

      <div className="flex justify-end w-full">
        <div className="flex gap-3">
          <Button variant={'outline'} className="mt-4">
            <Link href="/testcase">Run code</Link>
          </Button>
          <Button variant={'submit'} className="mt-4" onClick={handleSubmit}>
            <Link href={`${slug}/submission`}>Submit code</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
