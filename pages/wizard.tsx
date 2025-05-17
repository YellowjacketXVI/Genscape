import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ScapeWizard from '@/components/Scape/ScapeWizard';

export default function ScapeWizardPage() {
  const router = useRouter();
  const { id } = router.query;
  const [scape, setScape] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [step, setStep] = useState(1);
  const [scapeData, setScapeData] = useState({
    name: '',
    description: '',
    tags: [],
    widgets: [],
    permissions: {
      genGuard: false,
      datasetReuse: false,
      contentWarnings: {
        suggestive: false,
        political: false,
        violent: false,
        nudity: false,
      },
      visibility: 'private',
      approvalType: 'auto',
      pricingModel: 'free',
    }
  });

  // If id is provided, fetch the scape data
  useEffect(() => {
    if (id) {
      const fetchScape = async () => {
        setLoading(true);
        try {
          // Replace with actual API call
          const response = await fetch(`/api/scapes/${id}`);
          const data = await response.json();
          setScape(data);
          setScapeData(data);
        } catch (error) {
          console.error('Error fetching scape:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchScape();
    }
  }, [id]);

  const handleSaveScape = async (finalData) => {
    try {
      // Replace with actual API call
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/scapes/${id}` : '/api/scapes';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
      
      const data = await response.json();
      
      // Navigate to the scape page
      router.push(`/scape/${data.id}`);
    } catch (error) {
      console.error('Error saving scape:', error);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <div className="page-container">
      <header className="app-header">
        <button className="back-button" onClick={() => router.back()}>
          Back
        </button>
        <h1>{id ? 'Edit Scape' : 'Create New Scape'}</h1>
      </header>
      
      <ScapeWizard
        initialData={scapeData}
        onSave={handleSaveScape}
        isEditing={!!id}
      />
    </div>
  );
}
