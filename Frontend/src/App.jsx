import React, { useState, useEffect } from 'react';
import Header from './Components/Header.jsx';
import SideBar from './Components/SideBar.jsx';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default on all devices
  const [searchedVal, setSearchedVal] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [videos, setVideos] = useState([]);

  const refreshVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/videos');
      setVideos(response.data || []);
      console.log("VIDEOS FROM API:", response.data);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    }
  };

  useEffect(() => {
    refreshVideos();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSidebarOpen(false); // Ensure sidebar closes on resize
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 640; // Small devices
  const isTablet = windowWidth > 640 && windowWidth <= 1023; // Medium devices
  const isDesktop = windowWidth > 1023; // Large devices

  const handleSearch = () => setSearchActive(true);

  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchedVal={searchedVal}
        setSearchedVal={setSearchedVal}
        onSearch={handleSearch}
        refreshVideos={refreshVideos}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="flex min-h-screen pt-14  text-white">
        <SideBar sidebarOpen={sidebarOpen} isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
        <main className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8">
          <Outlet
            context={{
              sidebarOpen,
              searchedVal,
              setSearchedVal,
              searchActive,
              setSearchActive,
              videos,
              refreshVideos,
              selectedCategory,
            }}
          />
        </main>
      </div>
    </>
  );
}

export default App;