import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FeaturedWidget from './FeaturedWidget';

type ScapeStats = {
  likes: number;
  comments: number;
  views: number;
  shares?: number;
};

type ScapeUser = {
  id: string;
  username: string;
  avatar?: string;
};

type FeaturedWidget = {
  id: string;
  type: string;
  caption: string;
  mediaUrl: string;
  aspectRatio?: number;
};

type ScapePreview = {
  id: string;
  name: string;
  description?: string;
  createdBy: ScapeUser;
  featuredWidget?: FeaturedWidget;
  isShoppable: boolean;
  isFollowing: boolean;
  stats: ScapeStats;
  tags?: string[];
};

type FeedCardProps = {
  scape: ScapePreview;
  isDesktop: boolean;
  onSave?: () => void;
  onLike?: () => void;
};

export default function FeedCard({ 
  scape, 
  isDesktop, 
  onSave, 
  onLike 
}: FeedCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(scape.stats.likes);
  const [isFollowing, setIsFollowing] = useState(scape.isFollowing);

  const handleLike = () => {
    if (onLike) {
      onLike();
    } else {
      // Toggle like state
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      // Toggle save state
      setIsSaved(!isSaved);
    }
  };

  const handleFollow = () => {
    // Toggle follow state
    setIsFollowing(!isFollowing);
  };

  const navigateToScape = () => {
    router.push(`/scape/${scape.id}`);
  };

  const navigateToProfile = () => {
    router.push(`/profile/${scape.createdBy.id}`);
  };

  return (
    <div className={`feed-card ${isDesktop ? 'desktop' : 'mobile'}`}>
      {/* Featured Widget */}
      <div className="card-media" onClick={navigateToScape}>
        {scape.featuredWidget ? (
          <FeaturedWidget 
            widget={scape.featuredWidget} 
            isDesktop={isDesktop} 
          />
        ) : (
          <div className="placeholder-media">
            <span>{scape.name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="card-content">
        <div className="card-header">
          <div className="user-info" onClick={navigateToProfile}>
            <div className="user-avatar">
              {scape.createdBy.avatar ? (
                <img 
                  src={scape.createdBy.avatar} 
                  alt={scape.createdBy.username} 
                  className="avatar-image" 
                />
              ) : (
                <div className="avatar-placeholder">
                  {scape.createdBy.username.charAt(0)}
                </div>
              )}
            </div>
            <span className="username">@{scape.createdBy.username}</span>
          </div>
          
          <div className="card-actions">
            {scape.isShoppable && (
              <div className="shop-badge">
                <svg className="shop-icon" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span>Shop</span>
              </div>
            )}
            
            <button 
              className={`follow-button ${isFollowing ? 'following' : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
        
        <h3 className="card-title">{scape.name}</h3>
        
        {scape.description && (
          <p className="card-description">{scape.description}</p>
        )}
        
        <div className="card-footer">
          <div className="interaction-buttons">
            <button 
              className={`interaction-button ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
            >
              <svg className="interaction-icon" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              <span>{likeCount}</span>
            </button>
            
            <button 
              className="interaction-button"
              onClick={navigateToScape}
            >
              <svg className="interaction-icon" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              <span>{scape.stats.comments}</span>
            </button>
          </div>
          
          <button 
            className={`save-button ${isSaved ? 'active' : ''}`}
            onClick={handleSave}
          >
            <svg className="save-icon" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
