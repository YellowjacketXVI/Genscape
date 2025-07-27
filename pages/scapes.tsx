import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '@/components/Layout/BottomNav';

export default function ScapesManager() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('published');
  const [scapes, setScapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop or mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch scapes data
  useEffect(() => {
    const fetchScapes = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch(`/api/scapes?status=${activeTab}`);
        const data = await response.json();
        setScapes(data);
      } catch (error) {
        console.error('Error fetching scapes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScapes();
  }, [activeTab]);

  const handleCreateScape = () => {
    router.push('/scape-edit/new');
  };

  const handleEditScape = (scapeId) => {
    router.push(`/scape-edit/${scapeId}`);
  };

  const handleDeleteScape = async (scapeId) => {
    if (!confirm('Are you sure you want to delete this scape?')) return;

    try {
      // Replace with actual API call
      await fetch(`/api/scapes/${scapeId}`, {
        method: 'DELETE',
      });

      // Remove from list
      setScapes(scapes.filter(scape => scape.id !== scapeId));
    } catch (error) {
      console.error('Error deleting scape:', error);
    }
  };

  return (
    <div className="page-container">
      <header className="app-header">
        <h1>My Scapes</h1>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={handleCreateScape}
          >
            Create Scape
          </button>
        </div>
      </header>

      <div className="tabs-container">
        <button
          className={activeTab === 'published' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('published')}
        >
          Published
        </button>
        <button
          className={activeTab === 'drafts' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('drafts')}
        >
          Drafts
        </button>
      </div>

      <main className="scapes-container">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : scapes.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any {activeTab} scapes yet.</p>
            <button
              className="btn-secondary"
              onClick={handleCreateScape}
            >
              Create your first scape
            </button>
          </div>
        ) : (
          <div className={`scapes-grid ${isDesktop ? 'desktop' : 'mobile'}`}>
            {scapes.map((scape) => (
              <div key={scape.id} className="scape-card">
                <div
                  className="scape-preview"
                  onClick={() => router.push(`/scape/${scape.id}`)}
                >
                  {scape.featuredWidget?.mediaUrl ? (
                    <img
                      src={scape.featuredWidget.mediaUrl}
                      alt={scape.name}
                    />
                  ) : (
                    <div className="placeholder-preview">
                      {scape.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="scape-info">
                  <h3>{scape.name}</h3>
                  <p>{scape.description || 'No description'}</p>

                  <div className="scape-stats">
                    <span>{scape.stats?.views || 0} views</span>
                    <span>{scape.stats?.likes || 0} likes</span>
                  </div>

                  <div className="scape-actions">
                    <button
                      className="btn-text"
                      onClick={() => handleEditScape(scape.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-text danger"
                      onClick={() => handleDeleteScape(scape.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav activePage="scapes" />
    </div>
  );
}
