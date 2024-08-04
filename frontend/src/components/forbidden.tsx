import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <LockIcon className="h-20 w-20" />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">403</h1>
        <p className="text-sm">Access to this resource on the server is denied</p>
      </div>
      <Button variant="outline">
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
