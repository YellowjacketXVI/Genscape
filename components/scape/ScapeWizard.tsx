import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ScapeWizardProps {
  initialData: any;
  onSave: (data: any) => void;
  isEditing: boolean;
}

/**
 * ScapeWizard component that redirects to the new scape-edit path
 * This is a compatibility component to handle the transition from the wizard to the new editor
 */
export default function ScapeWizard({ initialData, onSave, isEditing }: ScapeWizardProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new scape-edit path
    const id = initialData?.id || `new-${Date.now()}`;
    const path = `/scape-edit/${id}`;
    
    console.log('Redirecting from wizard to new scape editor:', path);
    router.push(path);
  }, [initialData, router]);

  return (
    <div className="redirect-message">
      <p>Redirecting to the new Scape Editor...</p>
      <style jsx>{`
        .redirect-message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
