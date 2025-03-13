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
      
      if (session.user?.role === 'Admin') {
        router.replace('/admin/overview');
        
      } else if (session.user?.role === 'Doctor') {
        router.replace('/');
        
      } else {
        router.replace('/');
        
      }
    } else if (mode === 'protected' && !session) {
      
      router.replace('/sign-in');
      
    }
  }, [session, status, mode, router]);

  return { session, status };
}; 