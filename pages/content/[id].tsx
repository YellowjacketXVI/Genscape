import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SlidePanel from '@/components/layout/SlidePanel';
import { getTestUserMediaById } from '@/utils/mediaAssets';

export default function ContentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    tags: [],
    permissions: {
      genGuard: false,
      datasetReuse: false,
      contentWarnings: {
        suggestive: false,
        political: false,
        violent: false,
        nudity: false,
      },
    },
  });

  // Fetch media data
  useEffect(() => {
    if (!id) return;
    
    const fetchMedia = () => {
      setLoading(true);
      try {
        const data = getTestUserMediaById(id as string);
        if (data) {
          setMedia(data);
          setEditData({
            title: data.title || '',
            description: data.description || '',
            tags: data.tags || [],
            permissions: data.permissions || {
              genGuard: false,
              datasetReuse: false,
              contentWarnings: {
                suggestive: false,
                political: false,
              violent: false,
              nudity: false,
            },
          },
          });
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedia();
  }, [id]);

  const handleSave = () => {
    // Update local state only
    setMedia({
      ...media,
      title: editData.title,
      description: editData.description,
      tags: editData.tags,
      permissions: editData.permissions,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    // Navigate back to content manager
    router.push('/content');
  };

  if (loading || !media) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <div className="page-container">
      <header className="app-header">
        <button className="back-button" onClick={() => router.back()}>
          Back
        </button>
        <h1>{media.title || 'Media Detail'}</h1>
        <div className="header-actions">
          {isEditing ? (
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="btn-secondary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </header>
      
      <main className="media-detail-container">
        <div className="media-preview">
          {media.type === 'image' ? (
            <img 
              src={media.url} 
              alt={media.title || 'Image'} 
              className="media-image" 
            />
          ) : media.type === 'video' ? (
            <video 
              src={media.url} 
              controls 
              className="media-video" 
            />
          ) : media.type === 'audio' ? (
            <audio 
              src={media.url} 
              controls 
              className="media-audio" 
            />
          ) : (
            <div className="media-placeholder">
              Unsupported media type
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="media-edit-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                id="title" 
                value={editData.title} 
                onChange={(e) => setEditData({...editData, title: e.target.value})} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea 
                id="description" 
                value={editData.description} 
                onChange={(e) => setEditData({...editData, description: e.target.value})} 
              />
            </div>
            
            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input">
                {editData.tags.map((tag, index) => (
                  <div key={index} className="tag">
                    {tag}
                    <button 
                      className="tag-remove" 
                      onClick={() => {
                        const newTags = [...editData.tags];
                        newTags.splice(index, 1);
                        setEditData({...editData, tags: newTags});
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <input 
                  type="text" 
                  placeholder="Add tag..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setEditData({
                        ...editData, 
                        tags: [...editData.tags, e.target.value.trim()]
                      });
                      e.target.value = '';
                    }
                  }} 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Permissions</label>
              
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="genGuard" 
                  checked={editData.permissions.genGuard} 
                  onChange={(e) => setEditData({
                    ...editData, 
                    permissions: {
                      ...editData.permissions,
                      genGuard: e.target.checked
                    }
                  })} 
                />
                <label htmlFor="genGuard">GenGuard Protection</label>
              </div>
              
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="datasetReuse" 
                  checked={editData.permissions.datasetReuse} 
                  onChange={(e) => setEditData({
                    ...editData, 
                    permissions: {
                      ...editData.permissions,
                      datasetReuse: e.target.checked
                    }
                  })} 
                />
                <label htmlFor="datasetReuse">Allow Dataset Reuse</label>
              </div>
              
              <div className="content-warnings">
                <h4>Content Warnings</h4>
                
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="suggestive" 
                    checked={editData.permissions.contentWarnings.suggestive} 
                    onChange={(e) => setEditData({
                      ...editData, 
                      permissions: {
                        ...editData.permissions,
                        contentWarnings: {
                          ...editData.permissions.contentWarnings,
                          suggestive: e.target.checked
                        }
                      }
                    })} 
                  />
                  <label htmlFor="suggestive">Suggestive</label>
                </div>
                
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="political" 
                    checked={editData.permissions.contentWarnings.political} 
                    onChange={(e) => setEditData({
                      ...editData, 
                      permissions: {
                        ...editData.permissions,
                        contentWarnings: {
                          ...editData.permissions.contentWarnings,
                          political: e.target.checked
                        }
                      }
                    })} 
                  />
                  <label htmlFor="political">Political</label>
                </div>
                
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="violent" 
                    checked={editData.permissions.contentWarnings.violent} 
                    onChange={(e) => setEditData({
                      ...editData, 
                      permissions: {
                        ...editData.permissions,
                        contentWarnings: {
                          ...editData.permissions.contentWarnings,
                          violent: e.target.checked
                        }
                      }
                    })} 
                  />
                  <label htmlFor="violent">Violent</label>
                </div>
                
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="nudity" 
                    checked={editData.permissions.contentWarnings.nudity} 
                    onChange={(e) => setEditData({
                      ...editData, 
                      permissions: {
                        ...editData.permissions,
                        contentWarnings: {
                          ...editData.permissions.contentWarnings,
                          nudity: e.target.checked
                        }
                      }
                    })} 
                  />
                  <label htmlFor="nudity">Nudity</label>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn-danger" 
                onClick={handleDelete}
              >
                Delete Media
              </button>
            </div>
          </div>
        ) : (
          <div className="media-info">
            <h2>{media.title}</h2>
            <p className="media-description">{media.description || 'No description'}</p>
            
            <div className="media-metadata">
              <div className="metadata-item">
                <span className="metadata-label">Type:</span>
                <span className="metadata-value">{media.type}</span>
              </div>
              
              <div className="metadata-item">
                <span className="metadata-label">Size:</span>
                <span className="metadata-value">{media.size}</span>
              </div>
              
              <div className="metadata-item">
                <span className="metadata-label">Created:</span>
                <span className="metadata-value">{new Date(media.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="media-tags">
              {media.tags && media.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            
            <div className="media-permissions">
              <h3>Permissions</h3>
              
              <div className="permission-item">
                <span className="permission-label">GenGuard Protection:</span>
                <span className="permission-value">
                  {media.permissions?.genGuard ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              <div className="permission-item">
                <span className="permission-label">Dataset Reuse:</span>
                <span className="permission-value">
                  {media.permissions?.datasetReuse ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
              
              {media.permissions?.contentWarnings && Object.entries(media.permissions.contentWarnings).some(([_, value]) => value) && (
                <div className="content-warnings">
                  <h4>Content Warnings</h4>
                  <ul>
                    {media.permissions.contentWarnings.suggestive && <li>Suggestive</li>}
                    {media.permissions.contentWarnings.political && <li>Political</li>}
                    {media.permissions.contentWarnings.violent && <li>Violent</li>}
                    {media.permissions.contentWarnings.nudity && <li>Nudity</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <SlidePanel 
        title="Usage History" 
        isOpen={false} 
        onClose={() => {}}
      >
        <div className="usage-history">
          <p>This media has not been used in any scapes yet.</p>
        </div>
      </SlidePanel>
    </div>
  );
}
