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
import { Logout } from '@/components/logout';

const userRoutes = [
  { name: 'Logo', href: '/' },
  { name: 'Cuộc thi', href: '/tournaments' },
  { name: 'Vòng đấu', href: '/round' },
];

const adminRoutes = [
  { name: 'Logo', href: '/' },
  { name: 'Cuộc thi', href: '/tournaments' },
  { name: 'Vòng đấu', href: '/round' },
  { name: 'Bài toán', href: '/problems' },
];

export default function Header() {
  const { user } = useAppContext();
  console.log(user);

  const routes = user?.is_admin ? adminRoutes : userRoutes;

  return (
    <header className="fixed top-0 w-full flex justify-center bg-[#15518B] z-30 transition-all text-white">
      <div className="flex h-16 max-w-screen-2xl items-center justify-between w-full mx-[50px]">
        <div className="flex gap-5">
          {routes.map((route) => {
            return (
              <Link
                key={route.href}
                href={route.href}
                className="font-display text-xl hover:font-semibold transition duration-300"
              >
                {route.name}
              </Link>
            );
          })}
          {user?.is_admin && <AdminDropdown />}
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
                  <Link href={'/profile'} className="text-base hover:font-semibold transition duration-300">
                    Thông tin cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-5">
            <Link href="/login" className="font-display text-xl hover:font-semibold transition duration-300">
              Đăng nhập
            </Link>
            <Link href="/register" className="font-display text-xl hover:font-semibold transition duration-300">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function AdminDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger style={{ display: 'flex', alignItems: 'center' }} asChild>
        <p className="text-xl hover:font-semibold transition duration-300 cursor-pointer">Quản lý</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={'/testcase/'} className="text-base hover:font-semibold transition duration-300">
              Test case
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'/problem/'} className="text-base hover:font-semibold transition duration-300">
              Bài tập
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={'/submission/'}
              className="text-base hover:font-semibold transition duration-300 cursor-pointer"
            >
              Các bài nộp
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
