'use client';

import { useAppContext } from '@/app/app-provider';
import Forbidden from '@/components/forbidden';
import { CreateGroupReq, CreateGroupReqBody, CreateGroupReqType } from '@/schema/group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GroupFormField from '@/components/group/group-field';
import groupsApiRequest from '@/api/group';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function CreateGroupPage({ params }: { params: { id: string } }) {
  const { user } = useAppContext();
  const router = useRouter();

  const form = useForm<CreateGroupReqType>({
    resolver: zodResolver(CreateGroupReq),
    defaultValues: {
      numMatchRoundOf16: 3,
      numMatchQuarterFinal: 3,
      numMatchSemiFinal: 3,
      numMatchFinal: 5,
      group_num_match: 3,
    },
  });

  const groupsWatch = form.watch('groups');

  if (!user?.is_admin) {
    return <Forbidden />;
  }

  async function onSubmit(values: CreateGroupReqType) {
    const body: CreateGroupReqBody = {
      groups: values.groups,
      num_matchs: [
        values.numMatchRoundOf16,
        values.numMatchQuarterFinal,
        values.numMatchSemiFinal,
        values.numMatchFinal,
      ],
      group_num_match: values.group_num_match,
    };

    try {
      const res = await groupsApiRequest.createGroup(params.id, body);
      console.log(res);
      toast.success('Tạo bảng thi đấu thành công');
      router.push(`/tournaments/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <Card className="relative">
          <CardHeader className="p-5 flex flex-row align-middle justify-between border border-b-2 sticky z-20 top-20 bg-white">
            <CardTitle className="my-auto">Tạo Bảng Thi Đấu</CardTitle>
            <Button size={'lg'} className="text-base" type="submit">
              {form.formState.isSubmitting ? 'Đang tạo...' : 'Tạo'}
            </Button>
          </CardHeader>
          <CardContent className="mt-5">
            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="numMatchRoundOf16"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="min-w-36 text-lg">Hình thức thi đấu vòng 1/16: </FormLabel>
                    <FormControl>
                      <Input className="max-w-2xl" placeholder="Điền số trận" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numMatchQuarterFinal"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="min-w-36 text-lg">Hình thức thi đấu tứ kết: </FormLabel>
                    <FormControl>
                      <Input className="max-w-2xl" placeholder="Điền số trận" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-10 my-8">
              <FormField
                control={form.control}
                name="numMatchSemiFinal"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="min-w-36 text-lg">Hình thức thi đấu bán kết: </FormLabel>
                    <FormControl>
                      <Input className="max-w-2xl" placeholder="Điền số trận" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numMatchFinal"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="min-w-36 text-lg">Hình thức thi đấu chung kết: </FormLabel>
                    <FormControl>
                      <Input className="max-w-2xl" placeholder="Điền số trận" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-10 my-8">
              <FormField
                control={form.control}
                name="group_num_match"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="min-w-36 text-lg">Hình thức thi đấu vòng bảng: </FormLabel>
                    <FormControl>
                      <Input className="max-w-2xl" placeholder="Điền số trận" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="my-8">
              <FormItem className="flex-1">
                <FormLabel className="min-w-36 text-lg">Danh sách các bảng thi đấu: </FormLabel>
                <FormControl>
                  <GroupFormField
                    id={params.id}
                    control={form.control}
                    setValue={form.setValue}
                    getValues={form.getValues}
                    register={form.register}
                    groupsWatch={groupsWatch}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
