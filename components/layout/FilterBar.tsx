import { useState } from 'react';

type FilterBarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showSearch?: boolean;
};

export default function FilterBar({ 
  activeTab, 
  onTabChange, 
  showSearch = true 
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="filter-bar">
      {showSearch && (
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <svg className="search-icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            type="button" 
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg className="filter-icon" viewBox="0 0 24 24">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>
        </form>
      )}
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => onTabChange('explore')}
        >
          Explore
        </button>
        <button 
          className={`tab ${activeTab === 'followed' ? 'active' : ''}`}
          onClick={() => onTabChange('followed')}
        >
          Followed
        </button>
        <button 
          className={`tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => onTabChange('shop')}
        >
          Shop
        </button>
      </div>
      
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <h3>Sort By</h3>
            <select className="filter-select">
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
          
          <div className="filter-group">
            <h3>Content Type</h3>
            <div className="checkbox-group">
              <input type="checkbox" id="images" defaultChecked />
              <label htmlFor="images">Images</label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="audio" defaultChecked />
              <label htmlFor="audio">Audio</label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="shop" defaultChecked />
              <label htmlFor="shop">Shop</label>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="btn-text" onClick={() => setShowFilters(false)}>
              Cancel
            </button>
            <button className="btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
