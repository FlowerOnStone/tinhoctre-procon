'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  confirmPassword: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  email: z.string().email({
    message: 'Invalid email.',
  }),
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  defaultLanguage: z.string().min(2, {
    message: 'Please select a language.',
  }),
});

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: '',
      defaultLanguage: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-24">
      <h1 className="text-3xl ">Đăng ký</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/3 p-16 bg-[#EEEEEE] m-12">
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
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                <FormLabel className="min-w-36">Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                <FormLabel className="min-w-36">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                <FormLabel className="min-w-36">Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="defaultLanguage"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                <FormLabel className="min-w-36">Ngôn ngữ mặc định</FormLabel>
                <FormControl>
                  <Input placeholder="Default Language" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center flex-col items-center gap-3">
            <Button variant="login" type="submit" size="lg">
              Đăng ký
            </Button>

            <div>
              Đã có tài khoản?{' '}
              <Link href="login" className="text-[#14518B]">
                Đăng nhập
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
