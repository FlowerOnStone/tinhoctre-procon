'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';

const formSchema = z.object({
  zipFile: z
    .instanceof(File)
    .refine((file) => file.name.endsWith('.zip'), { message: 'Tệp phải có dạng .zip' }),
  grader: z.string().min(1, 'Grader là bắt buộc'),
  ioMethod: z.string().min(1, 'I/O Method là bắt buộc'),
  marker: z.string().min(1, 'Marker là bắt buộc'),
  outputLimit: z.string().min(1, 'Output limit là bắt buộc'),
});

interface TestCaseEditorProps {
  data?: {
    zipFile?: File;
    grader: string;
    ioMethod: string;
    marker: string;
    outputLimit: string;
  };
}

const TestCaseEditor: React.FC<TestCaseEditorProps> = ({ data }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipFile: data?.zipFile || undefined,
      grader: data?.grader || '',
      ioMethod: data?.ioMethod || '',
      marker: data?.marker || '',
      outputLimit: data?.outputLimit || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      form.setValue('zipFile', e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ borderRadius: 0, border: '1px solid #eeeeee' }} className="space-y-8 p-8 w-full bg-[#ffffff] rounded-md shadow-md">
          <FormField
            control={form.control}
            name="zipFile"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Tập tin dữ liệu nén dạng .zip</FormLabel>
                  <FormControl>
                    <div className="flex-col ml-10 items-center min-w-36">
                      <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>Hiện tại: {field.value ? (field.value as File).name : 'Chưa có tệp nào'}</p>
                      <Input className='mt-2' type="file" onChange={handleFileChange} />
                    </div>
                  </FormControl>
                  <FormMessage className="mt-2 ml-4" />
                </div>
                
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grader"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Grader</FormLabel>
                  <FormControl>
                    <Input placeholder="Grader" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="mt-2 ml-36" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ioMethod"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">I/O Method</FormLabel>
                  <FormControl>
                    <Input placeholder="I/O Method" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="mt-2 ml-36" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marker"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Trình chấm</FormLabel>
                  <FormControl>
                    <Input placeholder="Trình chấm" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="mt-2 ml-36" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outputLimit"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Hạn chế đầu ra</FormLabel>
                  <FormControl>
                    <Input placeholder="Hạn chế chiều dài đầu ra" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="mt-2 ml-36" />
              </FormItem>
            )}
          />
          {/* <div className="flex justify-center">
            <Button type="submit" size="lg" style={{ borderRadius: 0, backgroundColor: '#1C81BA' }}>
              {data ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div> */}
        </form>
      </Form>
    </div>
  );
};

export default TestCaseEditor;
