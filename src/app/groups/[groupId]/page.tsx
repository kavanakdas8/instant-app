"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function RedirectGroupDetails() {
  const router = useRouter();
  const { groupId } = useParams();
  useEffect(() => {
    router.replace(`/chats/${groupId}`);
  }, [groupId, router]);
  return null;
}
