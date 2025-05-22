import { useState, useEffect } from 'react';
import { getTestUserMediaById } from '@/utils/mediaAssets';

type AudioTrack = {
  id: string;
  mediaId: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl?: string; // Added for convenience after fetching
};

type AudioWidgetProps = {
  widget: {
    id: string;
    type: 'audio';
    title: string;
    playerType: 'standard' | 'playlist';
    tracks: AudioTrack[];
    currentTrack?: string;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
  onMediaSelect?: () => void;
};

export default function AudioWidget({ 
  widget, 
  isEditing, 
  onUpdate, 
  onMediaSelect 
}: AudioWidgetProps) {
  const [tracks, setTracks] = useState<AudioTrack[]>(widget.tracks || []);
  const [playerType, setPlayerType] = useState<'standard' | 'playlist'>(widget.playerType || 'standard');
  const [currentTrackId, setCurrentTrackId] = useState<string | undefined>(widget.currentTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch audio data when tracks change
  useEffect(() => {
    const fetchAudioData = async () => {
      if (!widget.tracks || widget.tracks.length === 0) {
        setTracks([]);
        return;
      }
      
      setLoading(true);
      
      try {
        // In a real app, this would be an API call to fetch audio details
        // For now, we'll just add audio URLs to the tracks
        const updatedTracks = widget.tracks.map((track) => {
          if (!track.mediaId) {
            return { ...track, audioUrl: undefined };
          }

          try {
            const media = getTestUserMediaById(track.mediaId);
            return {
              ...track,
              audioUrl: media ? media.url : undefined,
            };
          } catch (error) {
            console.error(`Error fetching media for track ${track.id}:`, error);
            return { ...track, audioUrl: undefined };
          }
        });
        
        setTracks(updatedTracks);
        
        // Set current track if not already set
        if (!currentTrackId && updatedTracks.length > 0) {
          setCurrentTrackId(updatedTracks[0].id);
          
          if (onUpdate) {
            onUpdate({
              ...widget,
              currentTrack: updatedTracks[0].id,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching audio data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAudioData();
  }, [widget.tracks]);

  const handlePlayerTypeChange = (newType: 'standard' | 'playlist') => {
    setPlayerType(newType);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        playerType: newType,
      });
    }
  };

  const handleRemoveTrack = (trackId: string) => {
    const updatedTracks = tracks.filter(track => track.id !== trackId);
    setTracks(updatedTracks);
    
    // Update current track if removed
    if (currentTrackId === trackId && updatedTracks.length > 0) {
      setCurrentTrackId(updatedTracks[0].id);
    } else if (updatedTracks.length === 0) {
      setCurrentTrackId(undefined);
    }
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        tracks: updatedTracks,
        currentTrack: currentTrackId === trackId && updatedTracks.length > 0 
          ? updatedTracks[0].id 
          : (updatedTracks.length === 0 ? undefined : currentTrackId),
      });
    }
  };

  const handleTrackChange = (trackId: string, field: string, value: any) => {
    const updatedTracks = tracks.map(track => {
      if (track.id === trackId) {
        return {
          ...track,
          [field]: value,
        };
      }
      return track;
    });
    
    setTracks(updatedTracks);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        tracks: updatedTracks,
      });
    }
  };

  const handleAddTrack = () => {
    if (onMediaSelect) {
      onMediaSelect();
      // The actual track would be added after media selection
      // This would be handled by the parent component
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  const handleTrackSelect = (trackId: string) => {
    setCurrentTrackId(trackId);
    setIsPlaying(true);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        currentTrack: trackId,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentTrack = tracks.find(track => track.id === currentTrackId);

  if (isEditing) {
    return (
      <div className="audio-widget editing">
        <div className="widget-edit-header">

          <div className="player-type-selector">
            <button
              className={`player-type-button ${playerType === 'standard' ? 'active' : ''}`}
              onClick={() => handlePlayerTypeChange('standard')}
              aria-label="Standard Player"
            />
            <button
              className={`player-type-button ${playerType === 'playlist' ? 'active' : ''}`}
              onClick={() => handlePlayerTypeChange('playlist')}
              aria-label="Playlist"
            />
          </div>
        </div>
        
        <div className="widget-edit-content">
          <div className="tracks-list">
            {tracks.length > 0 ? (
              <div className="tracks-edit-list">
                {tracks.map((track) => (
                  <div key={track.id} className="track-item-edit">
                    <div className="track-controls">
                      <button 
                        className="remove-track-button" 
                        onClick={() => handleRemoveTrack(track.id)}
                      >
                        &times;
                      </button>
                      
                      <button 
                        className={`play-track-button ${currentTrackId === track.id && isPlaying ? 'playing' : ''}`}
                        onClick={() => handleTrackSelect(track.id)}
                      >
                        {currentTrackId === track.id && isPlaying ? '❚❚' : '▶'}
                      </button>
                    </div>
                    
                    <div className="track-details-edit">
                      <input 
                        type="text" 
                        value={track.title} 
                        onChange={(e) => handleTrackChange(track.id, 'title', e.target.value)} 
                        placeholder="Track Title" 
                        className="track-title-input" 
                      />
                      
                      <input 
                        type="text" 
                        value={track.artist} 
                        onChange={(e) => handleTrackChange(track.id, 'artist', e.target.value)} 
                        placeholder="Artist" 
                        className="track-artist-input" 
                      />
                      
                      <div className="track-duration-container">
                        <input 
                          type="number" 
                          value={Math.floor(track.duration / 60)} 
                          onChange={(e) => {
                            const minutes = parseInt(e.target.value) || 0;
                            const seconds = track.duration % 60;
                            handleTrackChange(track.id, 'duration', minutes * 60 + seconds);
                          }} 
                          placeholder="Min" 
                          className="track-minutes-input" 
                          min="0" 
                        />
                        <span>:</span>
                        <input 
                          type="number" 
                          value={Math.floor(track.duration % 60).toString().padStart(2, '0')} 
                          onChange={(e) => {
                            const seconds = parseInt(e.target.value) || 0;
                            const minutes = Math.floor(track.duration / 60);
                            handleTrackChange(track.id, 'duration', minutes * 60 + seconds);
                          }} 
                          placeholder="Sec" 
                          className="track-seconds-input" 
                          min="0" 
                          max="59" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-tracks">
                <span>No audio tracks added yet</span>
              </div>
            )}
          </div>
          
          <button 
            className="add-track-button" 
            onClick={handleAddTrack}
          >
            Add Audio Track
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="audio-widget">
      {tracks.length > 0 ? (
        <div className={`audio-player ${playerType}`}>
          {/* Current Track Player */}
          {currentTrack && (
            <div className="current-track-player">
              <div className="track-info">
                <div className="track-title">{currentTrack.title}</div>
                <div className="track-artist">{currentTrack.artist}</div>
              </div>
              
              <div className="player-controls">
                <button 
                  className="play-pause-button" 
                  onClick={handlePlayPause}
                >
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                
                <div className="progress-bar">
                  <div className="progress-indicator" style={{ width: '30%' }}></div>
                </div>
                
                <div className="duration">{formatDuration(currentTrack.duration)}</div>
              </div>
            </div>
          )}
          
          {/* Playlist (only shown in playlist mode) */}
          {playerType === 'playlist' && (
            <div className="playlist">
              <h4 className="playlist-title">Playlist</h4>
              
              <div className="playlist-tracks">
                {tracks.map((track) => (
                  <div 
                    key={track.id} 
                    className={`playlist-track ${currentTrackId === track.id ? 'active' : ''}`}
                    onClick={() => handleTrackSelect(track.id)}
                  >
                    <div className="track-play-indicator">
                      {currentTrackId === track.id && isPlaying ? '❚❚' : '▶'}
                    </div>
                    <div className="track-info">
                      <div className="track-title">{track.title}</div>
                      <div className="track-artist">{track.artist}</div>
                    </div>
                    <div className="track-duration">{formatDuration(track.duration)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-audio-player">
          <svg className="empty-icon" viewBox="0 0 24 24">
            <path d="M9 18V5l12-2v13M9 9L1 6v10l8 3m12-9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
          </svg>
          <span>No audio tracks available</span>
        </div>
      )}
    </div>
  );
}
