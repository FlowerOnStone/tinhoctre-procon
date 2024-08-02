'use client';

import { useAppContext } from '@/app/app-provider';
import Link from 'next/link';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import userApiRequest from '@/api/user';
import { useRouter } from 'next/navigation';

const routes = [
  { name: 'Logo', href: '/' },
  { name: 'Tournaments', href: '/tournaments' },
];

export default function Header() {
  const { user, setUser } = useAppContext();
  const router = useRouter();

  async function handleLogout() {
    console.log('logout');
    try {
      await userApiRequest.logout().then(() => {
        console.log('logout success');
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  }

  return (
    <header className={`fixed top-0 w-full flex justify-center bg-[#15518B] z-30 transition-all text-white`}>
      <div className="mx-5 flex h-16 max-w-screen-2xl items-center justify-between w-full">
        <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="font-display text-xl">
              <p>{route.name}</p>
            </Link>
          ))}
        </div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-black">
                {user.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{user.first_name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-5">
            <Link href="/login" className="font-display text-xl">
              <p>Đăng nhập</p>
            </Link>
            <Link href="/register" className="font-display text-xl">
              <p>Đăng ký</p>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
