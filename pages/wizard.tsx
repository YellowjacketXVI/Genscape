import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ScapeWizardPage() {
  const router = useRouter();
  const { id } = router.query;

  // Redirect to the new scape-edit path
  useEffect(() => {
    const redirectPath = id ? `/scape-edit/${id}` : '/scape-edit/new';
    console.log('Redirecting from wizard to new scape editor:', redirectPath);
    router.push(redirectPath);
  }, [id, router]);

  return (
    <div className="page-container">
      <div className="loading-indicator">Redirecting to the new Scape Editor...</div>
    </div>
  );
}
