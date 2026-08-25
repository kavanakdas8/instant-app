"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectGroups() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/chats');
  }, [router]);
  return null;
}
