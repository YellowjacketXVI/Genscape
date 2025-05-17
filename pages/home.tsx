import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '@/components/Layout/BottomNav';
import FilterBar from '@/components/Layout/FilterBar';
import FeedCard from '@/components/Feed/FeedCard';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('explore');
  const [feedItems, setFeedItems] = useState([]);
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

  // Fetch feed data
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch(`/api/feed?tab=${activeTab}`);
        const data = await response.json();
        setFeedItems(data);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeed();
  }, [activeTab]);

  return (
    <div className="page-container">
      <header className="app-header">
        <h1>Genscape</h1>
        <div className="header-actions">
          {/* Notification icon would go here */}
        </div>
      </header>
      
      <FilterBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="feed-container">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <div className={`feed-grid ${isDesktop ? 'desktop' : 'mobile'}`}>
            {feedItems.map((item) => (
              <FeedCard 
                key={item.id} 
                scape={item} 
                isDesktop={isDesktop} 
              />
            ))}
          </div>
        )}
      </main>
      
      <BottomNav activePage="home" />
    </div>
  );
}
