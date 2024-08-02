'use client';

import { useAppContext } from '@/app/app-provider';
import Link from 'next/link';
import React, { useState } from 'react';
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
import { Logout } from '@/app/(auth)/logout/logout';

const userRoutes = [
  { name: 'Logo', href: '/' },
  { name: 'Cuộc thi', href: '/tournaments' },
];

const Header: React.FC = (): JSX.Element => {
  return localStorage.getItem('role') == 'admin' ? <AdminHeader /> : <UserHeader />;
};

export default Header;

const enableHoverEffect = (e: any) => {
  ( e.currentTarget ).style.fontWeight = '600';
  ( e.currentTarget ).style.transition = 'color 0.3s, font-weight 0.3s';
  ( e.currentTarget ).style.fontSize = 'fontSize: 16px';
  ( e.currentTarget ).style.cursor = 'pointer';
}

const disableHoverEffect = (e: any) => {
  ( e.currentTarget ).style.fontWeight = 'unset';
  ( e.currentTarget ).style.transition = 'unset';
  ( e.currentTarget ).style.fontSize = 'unset';
  ( e.currentTarget ).style.cursor = 'unset';
}

function UserHeader() {
  const { user } = useAppContext();
  const [hoverStates, setHoverStates] = useState<{ [key: string]: boolean }>({});

  const handleMouseEnter = (key: string) => {
    setHoverStates((prevStates) => ({ ...prevStates, [key]: true }));
  };

  const handleMouseLeave = (key: string) => {
    setHoverStates((prevStates) => ({ ...prevStates, [key]: false }));
  };

  return (
    <header className="fixed top-0 w-full flex justify-center bg-[#15518B] z-30 transition-all text-white">
      <div style={{ margin: '0px 50px' }} className="flex h-16 max-w-screen-2xl items-center justify-between w-full">
        <div className="flex gap-5">
          {userRoutes.map((route) => {
            const isHovered = hoverStates[route.href] || false;
            const linkStyle: React.CSSProperties = {
              fontWeight: isHovered ? '600' : undefined,
              transition: 'color 0.3s, font-weight 0.3s, text-decoration 0.3s',
              fontSize: '16px' 
            };

            return (
              <Link
                key={route.href}
                href={route.href}
                className="font-display text-xl"
              >
                <p
                  style={linkStyle}
                  onMouseEnter={() => handleMouseEnter(route.href)}
                  onMouseLeave={() => handleMouseLeave(route.href)}
                >
                  {route.name}
                </p>
              </Link>
            );
          })}
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
                  <Link href={'/profile'}>
                    {
                      <p
                      onMouseLeave={(e)=>{
                        ( e.currentTarget as HTMLTableCellElement ).style.fontWeight = 'unset';
                        ( e.currentTarget as HTMLTableCellElement ).style.transition = 'unset';
                        ( e.currentTarget as HTMLTableCellElement ).style.fontSize = 'unset';
                      }}
                      onMouseEnter={(e)=>{
                        ( e.currentTarget as HTMLTableCellElement ).style.fontWeight = '600';
                        ( e.currentTarget as HTMLTableCellElement ).style.transition = 'color 0.3s, font-weight 0.3s';
                        ( e.currentTarget as HTMLTableCellElement ).style.fontSize = 'fontSize: 16px';
                      }}>Thông tin cá nhân</p>
                    }
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <Logout></Logout>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-5">
            {['/login', '/register'].map((href) => {
              const isHovered = hoverStates[href] || false;
              const buttonStyle: React.CSSProperties = {
                fontWeight: isHovered ? '600' : undefined,
                transition: 'color 0.3s, font-weight 0.3s, text-decoration 0.3s',
                fontSize: '16px'
              };

              const buttonText = href === '/login' ? 'Đăng nhập' : 'Đăng ký';

              return (
                <Link key={href} href={href} className="font-display text-xl">
                  <p
                    style={buttonStyle}
                    onMouseEnter={() => handleMouseEnter(href)}
                    onMouseLeave={() => handleMouseLeave(href)}
                  >
                    {buttonText}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}


const adminRoutes = [
  { name: 'Logo', href: '/' },
  { name: 'Cuộc thi', href: '/tournaments' }
]

function AdminHeader() {
  const { user } = useAppContext();
  const [hoverStates, setHoverStates] = useState<{ [key: string]: boolean }>({});

  const handleMouseEnter = (key: string) => {
    setHoverStates((prevStates) => ({ ...prevStates, [key]: true }));
  };

  const handleMouseLeave = (key: string) => {
    setHoverStates((prevStates) => ({ ...prevStates, [key]: false }));
  };

  return (
    <header className="fixed top-0 w-full flex justify-center bg-[#15518B] z-30 transition-all text-white">
      <div style={{ margin: '0px 50px' }} className="flex h-16 max-w-screen-2xl items-center justify-between w-full">
        <div className="flex gap-5">
          {adminRoutes.map((route) => {
            const isHovered = hoverStates[route.href] || false;
            const linkStyle: React.CSSProperties = {
              fontWeight: isHovered ? '600' : undefined,
              transition: 'color 0.3s, font-weight 0.3s, text-decoration 0.3s',
              fontSize: '16px' 
            };

            return (
              <Link
                key={route.href}
                href={route.href}
                className="font-display text-xl"
              >
                <p
                  style={linkStyle}
                  onMouseEnter={() => handleMouseEnter(route.href)}
                  onMouseLeave={() => handleMouseLeave(route.href)}
                >
                  {route.name}
                </p>
              </Link>
            );
          })}
          <DropdownMenu>
            <DropdownMenuTrigger style={{display: 'flex', alignItems: 'center'}} asChild>
                  <p
                    onMouseLeave={(e)=>{
                      ( e.currentTarget ).style.fontWeight = 'unset';
                      ( e.currentTarget ).style.transition = 'unset';
                      ( e.currentTarget ).style.fontSize = 'unset';
                      ( e.currentTarget ).style.cursor = 'unset';
                    }}
                    onMouseEnter={(e)=>{
                      ( e.currentTarget ).style.fontWeight = '600';
                      ( e.currentTarget ).style.transition = 'color 0.3s, font-weight 0.3s';
                      ( e.currentTarget ).style.fontSize = 'fontSize: 16px';
                      ( e.currentTarget ).style.cursor = 'pointer';
                    }}>Quản lý</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href={'/testcase/'}>
                    {
                      <p
                        onMouseLeave={(e)=>disableHoverEffect(e)}
                        onMouseEnter={(e)=>enableHoverEffect(e)}>
                        Test case
                      </p>
                    }
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/problem/'}>
                    {
                      <p
                      onMouseLeave={(e)=>disableHoverEffect(e)}
                      onMouseEnter={(e)=>enableHoverEffect(e)}>Bài tập</p>
                    }
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/submission/'}>
                    {
                      <p
                      onMouseLeave={(e)=>disableHoverEffect(e)}
                      onMouseEnter={(e)=>enableHoverEffect(e)}>Các bài nộp</p>
                    }
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <Link href={'/profile'}>
                    {
                      <p
                      onMouseLeave={(e)=>disableHoverEffect(e)}
                      onMouseEnter={(e)=>enableHoverEffect(e)}>Thông tin cá nhân</p>
                    }
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <Logout></Logout>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-5">
            {['/login', '/register'].map((href) => {
              const isHovered = hoverStates[href] || false;
              const buttonStyle: React.CSSProperties = {
                fontWeight: isHovered ? '600' : undefined,
                cursor: isHovered ? 'pointer': 'unset',
                transition: 'color 0.3s, font-weight 0.3s, text-decoration 0.3s',
                fontSize: '16px'
              };

              const buttonText = href === '/login' ? 'Đăng nhập' : 'Đăng ký';

              return (
                <Link key={href} href={href} className="font-display text-xl">
                  <p
                    style={buttonStyle}
                    onMouseEnter={() => handleMouseEnter(href)}
                    onMouseLeave={() => handleMouseLeave(href)}
                  >
                    {buttonText}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  )
}