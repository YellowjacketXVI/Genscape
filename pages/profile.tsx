import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BottomNav from '@/components/layout/BottomNav';
import FeedCard from '@/components/Feed/FeedCard';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [userScapes, setUserScapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scapes');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
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

  // Fetch profile data
  useEffect(() => {
    if (!id) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Replace with actual API calls
        const profileResponse = await fetch(`/api/users/${id}`);
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        // Check if this is the current user
        const currentUserResponse = await fetch('/api/users/me');
        const currentUserData = await currentUserResponse.json();
        setIsCurrentUser(currentUserData.id === profileData.id);
        
        // Check if following
        if (!isCurrentUser) {
          const followingResponse = await fetch(`/api/users/me/following/${id}`);
          const followingData = await followingResponse.json();
          setIsFollowing(followingData.isFollowing);
        }
        
        // Fetch user's scapes
        const scapesResponse = await fetch(`/api/users/${id}/scapes`);
        const scapesData = await scapesResponse.json();
        setUserScapes(scapesData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      // Replace with actual API call
      const method = isFollowing ? 'DELETE' : 'POST';
      await fetch(`/api/users/me/following/${id}`, {
        method,
      });
      
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  if (loading || !profile) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <div className="page-container">
      <header className="profile-header">
        <div className="profile-banner">
          {profile.bannerImage ? (
            <img 
              src={profile.bannerImage} 
              alt={`${profile.username}'s banner`} 
              className="banner-image" 
            />
          ) : (
            <div className="banner-placeholder"></div>
          )}
        </div>
        
        <div className="profile-info">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.username} 
                className="avatar-image" 
              />
            ) : (
              <div className="avatar-placeholder">
                {profile.username.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="profile-details">
            <h1>{profile.username}</h1>
            <p className="profile-bio">{profile.bio || 'No bio provided'}</p>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{profile.stats.scapes}</span>
                <span className="stat-label">Scapes</span>
              </div>
              <div className="stat">
                <span className="stat-value">{profile.stats.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{profile.stats.following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            {isCurrentUser ? (
              <button 
                className="btn-secondary" 
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            ) : (
              <button 
                className={isFollowing ? 'btn-secondary' : 'btn-primary'} 
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </header>
      
      <div className="tabs-container">
        <button 
          className={activeTab === 'scapes' ? 'tab active' : 'tab'} 
          onClick={() => setActiveTab('scapes')}
        >
          Scapes
        </button>
        <button 
          className={activeTab === 'collections' ? 'tab active' : 'tab'} 
          onClick={() => setActiveTab('collections')}
        >
          Collections
        </button>
      </div>
      
      <main className="profile-content">
        {activeTab === 'scapes' ? (
          userScapes.length === 0 ? (
            <div className="empty-state">
              <p>No scapes to display</p>
            </div>
          ) : (
            <div className={`feed-grid ${isDesktop ? 'desktop' : 'mobile'}`}>
              {userScapes.map((scape) => (
                <FeedCard 
                  key={scape.id} 
                  scape={scape} 
                  isDesktop={isDesktop} 
                />
              ))}
            </div>
          )
        ) : (
          <div className="empty-state">
            <p>No collections to display</p>
          </div>
        )}
      </main>
      
      <BottomNav activePage="profile" />
    </div>
  );
}
