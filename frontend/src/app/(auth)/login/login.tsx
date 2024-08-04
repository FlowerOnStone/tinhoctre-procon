'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { PasswordInput } from '@/components/password-input';
import { LoginBody, LoginBodyType } from '@/schema/user';
import userApiRequest from '@/api/user';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/app-provider';

export default function Login() {
  const router = useRouter();
  const { setUser } = useAppContext();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    // console.log(values);

    try {
      const response = await userApiRequest.login(values);
      await userApiRequest.auth({ token: response.token });

      // add attribute to response.user
<<<<<<< HEAD
      const user = { ...response.user};
      setUser(user);
=======
      setUser(response.user);
>>>>>>> main
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error(error.response.data);
      alert(error.response.data.message);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl ">Đăng nhập</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-2/5 p-12 bg-[#EEEEEE] m-12">
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
          <div className="flex justify-center flex-col items-center gap-1">
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
