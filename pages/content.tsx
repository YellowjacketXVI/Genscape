import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '@/components/layout/BottomNav';
import MediaGrid from '@/components/Content/MediaGrid';
import UploadPanel from '@/components/Content/UploadPanel';
import FileDetailsPanel from '@/components/Content/FileDetailsPanel';

export default function ContentManager() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('grid');
  const [zoomLevel, setZoomLevel] = useState(75); // 25-100%
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [contentItems, setContentItems] = useState([]);
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

  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch('/api/content');
        const data = await response.json();
        setContentItems(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowDetailsPanel(true);
  };

  const handleGenerateClick = () => {
    router.push('/generate');
  };

  return (
    <div className="page-container">
      <header className="app-header">
        <h1>Content Manager</h1>
        <div className="header-actions">
          <button 
            className="btn-primary" 
            onClick={() => setShowUploadPanel(true)}
          >
            Upload
          </button>
          <button 
            className="btn-secondary" 
            onClick={handleGenerateClick}
          >
            Generate
          </button>
        </div>
      </header>
      
      <div className="content-controls">
        <div className="view-controls">
          <button 
            className={viewMode === 'grid' ? 'active' : ''} 
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
        
        <div className="zoom-control">
          <input 
            type="range" 
            min="25" 
            max="100" 
            value={zoomLevel} 
            onChange={(e) => setZoomLevel(parseInt(e.target.value))} 
          />
          <span>{zoomLevel}%</span>
        </div>
      </div>
      
      <main className="content-container">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <MediaGrid 
            items={contentItems} 
            viewMode={viewMode} 
            zoomLevel={zoomLevel} 
            onItemClick={handleItemClick} 
            isDesktop={isDesktop} 
          />
        )}
      </main>
      
      {showUploadPanel && (
        <UploadPanel 
          onClose={() => setShowUploadPanel(false)} 
          onUploadComplete={() => {
            setShowUploadPanel(false);
            // Refresh content
          }} 
        />
      )}
      
      {showDetailsPanel && selectedItem && (
        <FileDetailsPanel 
          item={selectedItem} 
          onClose={() => setShowDetailsPanel(false)} 
          onUpdate={() => {
            setShowDetailsPanel(false);
            // Refresh content
          }} 
        />
      )}
      
      <BottomNav activePage="content" />
    </div>
  );
}
