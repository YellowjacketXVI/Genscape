import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ScapeMaster from '@/components/scape/ScapeMaster';

export default function ScapeMasterPage() {
  const router = useRouter();
  const { id } = router.query;
  const [scape, setScape] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchScape = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/scapes/${id}`);
        const data = await response.json();
        setScape(data);
      } catch (err) {
        console.error('Failed to load scape:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScape();
  }, [id]);

  if (loading || !scape) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <div className="page-container">
      <ScapeMaster scape={scape} />
    </div>
  );
}
