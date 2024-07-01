'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const routes = [
  { name: 'Logo', href: '/' },
  { name: 'Thi đấu', href: '/matches' },
  { name: 'Cuộc thi', href: '/competitions' },
  { name: 'Thư viện', href: '/library' },
];

export default function Header({ isFixed = true }: { isFixed?: boolean }) {
  return (
    <header
      className={`${
        isFixed ? 'fixed' : 'sticky'
      } top-0 w-full flex justify-center bg-[#15518B] z-30 transition-all text-white`}
    >
      <div className="mx-5 flex h-16 max-w-screen-2xl items-center justify-between w-full">
        <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="font-display text-xl">
              <p>{route.name}</p>
            </Link>
          ))}
        </div>
        <div className="flex gap-5">
          {/* {session ? (
            <UserDropdown session={session} />
          ) : ( */}
          <Link href="/login" className="font-display text-xl">
            <p>Đăng nhập</p>
          </Link>
          <Link href="/register" className="font-display text-xl">
            <p>Đăng ký</p>
          </Link>
          {/* )} */}
        </div>
      </div>
    </header>
  );
}
