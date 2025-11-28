import { useState, useEffect } from 'react';

interface PageContent {
  id: number;
  section_key: string;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const API_URL = 'https://sme-res.org/api';

export const usePageContent = (sectionKey: string) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/sections.php?section_key=${sectionKey}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setContent(data[0]);
        } else if (data && !Array.isArray(data)) {
          setContent(data);
        } else {
          setError('Content not found');
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (sectionKey) {
      fetchContent();
    }
  }, [sectionKey]);

  return { content, loading, error };
};

export default usePageContent;
