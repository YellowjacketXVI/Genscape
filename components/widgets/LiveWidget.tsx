import React from 'react';

type Comment = {
  id: string;
  username: string;
  preview: string;
  timeAgo: string;
};

type Props = {
  size: 'sm' | 'md' | 'lg';
  isLive: boolean;
  duration: string;
  comments: Comment[];
};

const LiveWidget: React.FC<Props> = ({ size, isLive, duration, comments }) => {
  if (!isLive) return null;

  const sizeClass = `live-widget-${size}`;

  return (
    <div className={`live-widget ${sizeClass}`}>
      <div className="live-preview">
        <div className="live-video-icon">📹</div>
        <div className="live-info">
          <p className="live-title">Join the live stream</p>
          <div className="live-status">
            <span className="live-badge">Live</span>
            <span className="live-timer">{duration}</span>
          </div>
        </div>
      </div>

      {(size === 'md' || size === 'lg') && (
        <div className="live-comments">
          <p className="comments-header">Comments</p>
          {comments.slice(0, size === 'md' ? 2 : 6).map((comment) => (
            <div key={comment.id} className="comment-row">
              <strong>{comment.username}</strong>
              <span className="comment-preview">{comment.preview}</span>
              <span className="comment-time">{comment.timeAgo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveWidget;
