'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CreateTournamentForm, CreateTournamentFormType } from '@/schema/tournament';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { TimePickerDemo } from '@/components/datetime/time-picker-demo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vi } from 'date-fns/locale/vi';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useEffect, useState } from 'react';
import problemsApiRequest from '@/api/problem';
import { ProblemListResType } from '@/schema/problem';
import { ParticipantsTable } from '@/components/table/participant-table';
import { UserListResType } from '@/schema/user';
import userApiRequest from '@/api/user';
import { participantColumns } from '@/components/tournament/create/participant-column';
import tournamentApiRequest from '@/api/tournament';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/app-provider';
import Forbidden from '@/components/forbidden';

export default function CreateTournamentPage() {
  const { user } = useAppContext();
  const router = useRouter();
  const [problemList, setProblemList] = useState<ProblemListResType>([]);
  const [participants, setParticipants] = useState<UserListResType>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const [problemRes, participantRes] = await Promise.all([
          problemsApiRequest.getProblems(),
          userApiRequest.getListUser(),
        ]);
        setProblemList(problemRes);
        setParticipants(participantRes);
      } catch (error) {
        alert('Failed to fetch problem list');
      }
    };
    fetchRequest();
  }, []);

  const form = useForm<CreateTournamentFormType>({
    resolver: zodResolver(CreateTournamentForm),
    defaultValues: {
      name: '',
      num_group: 8,
      participants: [],
      problem: 0,
    },
  });

  if (!user?.is_admin) {
    return <Forbidden />;
  }

  async function onSubmit(values: CreateTournamentFormType) {
    if (values.participants.length % values.num_group !== 0) {
      form.setError('participants', {
        type: 'manual',
        message: 'Số lượng người tham gia phải chia đều được cho số lượng nhóm',
      });
      return;
    }

    // make Form data
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('num_group', values.num_group.toString());
    formData.append('problem', values.problem.toString());
    formData.append('start_submission_time', values.start_submission_time.toISOString());
    formData.append('end_submission_time', values.end_submission_time.toISOString());
    formData.append('start_combat_time', values.start_combat_time.toISOString());
    formData.append('end_combat_time', values.end_combat_time.toISOString());
    values.participants.forEach((participant) => {
      formData.append('participants', participant.toString());
    });

    try {
      await tournamentApiRequest.createTournament(formData);
      toast.success('Tạo cuộc thi thành công');
      router.push('/tournaments');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Tạo cuộc thi thất bại');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <Card className="relative">
          <CardHeader className="p-5 flex flex-row align-middle justify-between border border-b-2 sticky z-20 top-20 bg-white">
            <CardTitle className="my-auto">Tạo cuộc thi</CardTitle>
            <Button size={'lg'} className="text-base" type="submit">
              {form.formState.isSubmitting ? 'Đang tạo...' : 'Tạo'}
            </Button>
          </CardHeader>
          <CardContent className="mt-5">
            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="min-w-36 text-lg">Tên cuộc thi: </FormLabel>
                    <FormControl>
                      <Input className="max-w-2xl" placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_group"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="min-w-36 text-lg">Số nhóm: </FormLabel>
                    <FormControl>
                      <Input type="number" className="max-w-sm" placeholder="Number of groups" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-10 my-8">
              <FormField
                control={form.control}
                name="start_submission_time"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel className="text-left text-lg w-fit">Thời gian bắt đầu nộp bài</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[400px] justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'HH:mm:ss dd/MM/yyyy', { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <div className="p-3 border-b border-border">
                          <TimePickerDemo setDate={field.onChange} date={field.value} />
                        </div>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_submission_time"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel className="text-left text-lg w-fit">Thời gian kết thúc nộp bài</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[400px] justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'HH:mm:ss dd/MM/yyyy', { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <div className="p-3 border-b border-border">
                          <TimePickerDemo setDate={field.onChange} date={field.value} />
                        </div>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-10 my-8">
              <FormField
                control={form.control}
                name="start_combat_time"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel className="text-left text-lg w-fit">Thời gian bắt đầu thi đấu</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[400px] justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'HH:mm:ss dd/MM/yyyy', { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <div className="p-3 border-b border-border">
                          <TimePickerDemo setDate={field.onChange} date={field.value} />
                        </div>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_combat_time"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel className="text-left text-lg w-fit">Thời gian kết thúc thi đấu</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-[400px] justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'HH:mm:ss dd/MM/yyyy', { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <div className="p-3 border-b border-border">
                          <TimePickerDemo setDate={field.onChange} date={field.value} />
                        </div>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-fit">
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-lg">Bài toán</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn('w-[600px] justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value
                              ? problemList.find((problem) => problem.id === field.value)?.name
                              : 'Chọn bài toán '}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[600px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm bài toán..." />
                          <CommandList>
                            <CommandEmpty>Không có bài toán nào.</CommandEmpty>
                            {problemList.length > 0 && (
                              <CommandGroup>
                                {problemList.map((problem) => (
                                  <CommandItem
                                    value={problem.name}
                                    key={problem.id}
                                    onSelect={() => {
                                      form.setValue('problem', problem.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        problem.id === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {problem.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-10 my-8">
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel className="text-lg">Danh sách thí sinh</FormLabel>
                    <FormControl>
                      <ParticipantsTable
                        columns={participantColumns}
                        data={participants}
                        showSearch
                        showRowSelection
                        updateForm={(selectedRows) => form.setValue('participants', selectedRows)}
                      ></ParticipantsTable>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
