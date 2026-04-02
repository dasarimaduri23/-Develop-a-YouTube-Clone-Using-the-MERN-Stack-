import React, { useState, useEffect } from 'react';
import Video from './Video.jsx';
import { useOutletContext, useLocation } from 'react-router-dom';

function VideoList({ sidebarOpen }) {
  const categories = [
    'All', 'Programming', 'Tech', 'Design', 'AI', 'Movie',
    'Gaming', 'Vlogs', 'Music', 'Education',
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState([]);

  const {
    searchedVal,
    setSearchedVal,
    searchActive,
    setSearchActive,
    videos,
    refreshVideos,
  } = useOutletContext();

  const location = useLocation();

  // Filter videos based on search
  useEffect(() => {
    if (searchActive && searchedVal.trim()) {
      const term = searchedVal.trim().toLowerCase();
      const filtered = videos.filter((v) =>
        v.title?.toLowerCase().includes(term)
      );
      setFilteredVideos(filtered);
      setSelectedCategory('All');
      setSearchActive(false);
    }
  }, [searchActive, searchedVal, videos, setSearchActive]);

  // Update filtered videos when category or videos change
  useEffect(() => {
    if (searchedVal.trim() === '') {
      if (selectedCategory === 'All') {
        setFilteredVideos(videos);
      } else {
        const filtered = videos.filter((v) =>
          v.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
        setFilteredVideos(filtered);
      }
    }
  }, [searchedVal, selectedCategory, videos]);

  // Reset filters when navigating to "/"
  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedCategory('All');
      setSearchedVal('');
      setSearchActive(false);
      setFilteredVideos(videos);
    }
  }, [location.pathname, videos, setSearchedVal, setSearchActive]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setSearchedVal('');
    setSearchActive(false);

    if (cat === 'All') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter((v) =>
        v.category?.toLowerCase() === cat.toLowerCase()
      );
      setFilteredVideos(filtered);
    }
  };

  return (
    <div
      className="px-2 sm:px-4 md:px-6 lg:px-8 pt-4 min-h-[calc(100vh-56px)] text-black"
    >
      {/* Category Filter Bar */}
      <div className="flex gap-2 overflow-x-auto py-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <Video key={video._id} {...video} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 mt-10">
            No videos found.
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoList;