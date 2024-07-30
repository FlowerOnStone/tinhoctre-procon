'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { PasswordInput } from '@/components/password-input';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-24">
      <h1 className="text-3xl ">Đăng nhập</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/3 p-12 bg-[#EEEEEE] m-12">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                <FormLabel className="min-w-36 ">Tên đăng nhập</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                <FormLabel className="min-w-36">Mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center flex-col items-center gap-2">
            <Button variant={'link'} className="p-0 text-[#14518B]" asChild>
              <Link href="forgot-password">Quên mật khẩu?</Link>
            </Button>

            <Button variant="login" type="submit" size="lg">
              Đăng nhập
            </Button>

            <div>
              <span className="text-sm">Chưa có tài khoản?&nbsp;</span>
              <Button variant={'link'} className="p-0 text-[#14518B]" asChild>
                <Link href="register">Đăng ký</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
