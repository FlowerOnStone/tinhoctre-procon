"use client";
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  score: z.number().min(1, 'Điểm số ít nhất là 1'),
  time: z.number().min(1, 'Thời gian phải lớn hơn 1 phút'),
  htmlContent: z.string().min(1, 'Nội dung là bắt buộc'),
});

type FormData = z.infer<typeof formSchema>;

interface Problem {
  data?: {
    title: string;
    score: number;
    time: number;
    htmlContent: string;
  }
}

const ProblemEditor: React.FC<Problem> = ({ data }) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || '',
      score: data?.score || 0,
      time: data?.time || 0,
      htmlContent: data?.htmlContent || '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (formData) => {
    console.log(formData);
  };

  return (
    <div style={{ margin: '50px 100px' }}>
      <h1 className="text-3xl mb-8 font-bold">Thêm Bài tập mới</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 p-8 w-full bg-[#ffffff] rounded-md shadow-md">
          <FormField
            control={methods.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder="Tiêu đề" {...field} />
                </FormControl>
                <FormMessage>{methods.formState.errors.title?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm số</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Điểm số" {...field} />
                </FormControl>
                <FormMessage>{methods.formState.errors.score?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian (phút)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Thời gian (phút)" {...field} />
                </FormControl>
                <FormMessage>{methods.formState.errors.time?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="htmlContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                <Editor
                        apiKey='cdrgwokkdjisah1kxyv2xdszihjq1qqmzvr4cl2l8vpsx743'
                        init={{
                        height: 800,
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        }}
                        initialValue={data?.htmlContent || '<p style = "text-align: center">Thêm Bài tập mới tại đây</p>'}
                        onEditorChange={(content) => methods.setValue('htmlContent', content)}
                    />
                </FormControl>
                <FormMessage>{methods.formState.errors.htmlContent?.message}</FormMessage>
              </FormItem>
            )}
          /> 
          <div className="flex justify-center">
            <Button type="submit" size="lg" style={{ borderRadius: 0, backgroundColor: '#1C81BA' }}>
              Thêm
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default ProblemEditor;
