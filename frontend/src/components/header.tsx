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
import { LogOut as LogOutIcon, User } from 'lucide-react';
import { Logout } from '@/components/logout';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const userRoutes = [
  { name: 'Cuộc thi', href: '/tournaments' },
  { name: 'Vòng đấu', href: '/round' },
];

const adminRoutes = [
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
        <div className="flex gap-5 items-center justify-between h-full">
          <Link href="/">
            <Image src="/assets/logo.png" className="object-cover" height={36} width={108} alt="IMG1" />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {routes.map((route) => (
                <NavigationMenuItem key={route.name}>
                  <Link key={route.href} href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() +
                        'py-0 rounded-none text-lg bg-[transparent] hover:bg-white/45 hover:text-white'
                      }
                    >
                      {route.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

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
                  <Link href={'/profile'} className="w-full text-base hover:font-semibold transition duration-300">
                    Thông tin cá nhân
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-5">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/login" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() +
                        'py-0 rounded-none text-lg bg-[transparent] hover:bg-white/45 hover:text-white'
                      }
                    >
                      Đăng nhập
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/register" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() +
                        'py-0 rounded-none text-lg bg-[transparent] hover:bg-white/45 hover:text-white '
                      }
                    >
                      Đăng ký
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </div>
    </header>
  );
}

function AdminDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center" asChild>
        <p
          className={
            navigationMenuTriggerStyle() +
            'hover:font-semibold transition duration-300 cursor-pointer py-0 rounded-none text-lg bg-[transparent] hover:bg-white/45 hover:text-white'
          }
        >
          Quản lý
        </p>
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
