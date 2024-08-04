'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { PasswordInput } from '@/components/password-input';
import { RegisterBody, RegisterBodyType } from '@/schema/user';
import { ListProgrammingLanguageType, ListTimezoneType } from '@/schema/common';
import userApiRequest from '@/api/user';
import { useAppContext } from '@/app/app-provider';
import { useRouter } from 'next/navigation';

interface RegisterProps {
  timezones: ListTimezoneType;
  programmingLanguages: ListProgrammingLanguageType;
}

export default function Register({ timezones, programmingLanguages }: RegisterProps) {
  const { setUser } = useAppContext();
  const router = useRouter();

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      first_name: '',
      last_name: '',
      preferred_language: 1,
      timezone: timezones.find((timezone) => timezone.location === 'Ho_Chi_Minh')?.id || timezones[0].id,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    console.log(values);
    try {
      const response = await userApiRequest.register(values);

      await userApiRequest.auth({ token: response.token });

      setUser(response.user);
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error(error.response.data);
      alert(error.response.data.message);
    }
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl ">Đăng ký</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-2/5 p-16 bg-[#EEEEEE] m-12">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Trường</FormLabel>
                  <FormControl>
                    <Input placeholder="Trường" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36 ">Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm Password" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Múi giờ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={
                      timezones.find((timezone) => timezone.location === 'Ho_Chi_Minh')?.id.toString() ||
                      timezones[0].id.toString()
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timezones
                        .slice()
                        .sort((a, b) => a.offset_dst - b.offset_dst)
                        .map((timezone) => (
                          <SelectItem key={timezone.id} value={timezone.id.toString()}>
                            {`${timezone.location} (GMT${timezone.offset_dst >= 0 ? '+' : ''}${
                              timezone.offset_dst / 3600
                            })`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferred_language"
            render={({ field }) => (
              <FormItem>
                <div className="flex w-full items-center">
                  <FormLabel className="min-w-36">Ngôn ngữ mặc định</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="1">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programmingLanguages.map((language) => (
                        <SelectItem key={language.id} value={language.id.toString()}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center flex-col items-center gap-3">
            <Button variant="login" type="submit" size="lg">
              Đăng ký
            </Button>

            <div>
              <span className="text-sm">Đã có tài khoản?&nbsp;</span>
              <Button variant="link" size="sm" className="p-0 text-[#14518B]" asChild>
                <Link href="login" className="text-[#14518B]">
                  Đăng nhập
                </Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
