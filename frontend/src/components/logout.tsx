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
      <p
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLParagraphElement).style.fontWeight = 'unset';
          (e.currentTarget as HTMLParagraphElement).style.transition = 'unset';
          (e.currentTarget as HTMLParagraphElement).style.fontSize = 'unset';
          (e.currentTarget as HTMLParagraphElement).style.cursor = 'unset';
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLParagraphElement).style.fontWeight = '600';
          (e.currentTarget as HTMLParagraphElement).style.transition = 'color 0.3s, font-weight 0.3s';
          (e.currentTarget as HTMLParagraphElement).style.fontSize = '14px';
          (e.currentTarget as HTMLParagraphElement).style.cursor = 'pointer';
        }}
        onClick={handleLinkClick}
      >
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
