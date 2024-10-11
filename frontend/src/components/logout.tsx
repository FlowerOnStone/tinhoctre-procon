'use client';
import userApiRequest from '@/api/user';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/app-provider';

export function Logout() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setUser } = useAppContext();

  async function handleLogout() {
    try {
      const response = await userApiRequest.logout();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleLinkClick = (e: MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <p onClick={handleLinkClick} className="w-full text-base hover:font-semibold transition duration-300">
        Đăng xuất
      </p>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>Bạn có muốn đăng xuất khỏi hệ thống không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-[#14518B]"
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
            >
              Đồng ý
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setOpen(false)}>Hủy</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
