'use client';

import { useState, useEffect } from 'react';
import { Content } from '@/lib/types';
/** @description React hook for fetching and managing content state */


/**
 * Hook to fetch all content from the marketplace
 */
export function useContent() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, []);

  return { content, isLoading, error };
}

/**
 * Hook to fetch single content by ID
 */
export function useContentById(id: string | null) {
  const [data, setData] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchContentDetail() {
      try {
        const response = await fetch(`/api/content/${id}`);
        if (!response.ok) throw new Error('Content not found');
        const contentData = await response.json();
        setData(contentData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContentDetail();
  }, [id]);

  return { data, isLoading, error };
}
