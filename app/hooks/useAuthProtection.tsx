'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DefaultSession } from 'next-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Extend the Session type to include our custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      access_token: string;
    } & DefaultSession["user"]
  }
}

export const useAuthProtection = (mode: 'protected' | 'public') => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (mode === 'public' && session) {
      // If the page is public (like sign-in/sign-up) and user is logged in,
      // redirect to home or their role-specific page
      if (session.user?.role === 'Admin') {
        router.replace('/admin/overview');
        toast.error('You are already logged in');
      } else if (session.user?.role === 'Doctor') {
        router.replace('/doctor/overview');
        toast.error('You are already logged in');
      } else {
        router.replace('/');
        toast.error('You are already logged in');
      }
    } else if (mode === 'protected' && !session) {
      // If the page is protected and user is not logged in,
      // redirect to sign-in
      router.replace('/sign-in');
      toast.error('Please sign in to access this page');
    }
  }, [session, status, mode, router]);

  return { session, status };
}; 