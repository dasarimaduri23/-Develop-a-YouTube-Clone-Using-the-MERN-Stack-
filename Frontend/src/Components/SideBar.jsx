import React from 'react';
import { Link } from 'react-router-dom';

// Icons
import { IoMdHome, IoMdTime } from 'react-icons/io';
import { SiYoutubeshorts } from 'react-icons/si';
import {
  MdSubscriptions,
  MdOutlineVideoLibrary,
  MdOutlineWatchLater,
  MdThumbUpAlt,
  MdOutlineExplore,
  MdOutlineShoppingBag,
  MdOutlinePodcasts,
  MdOutlineFeedback,
  MdHelpOutline,
  MdSettings,
} from 'react-icons/md';
import { RiHistoryLine } from 'react-icons/ri';
import { FaYoutube, FaYoutubeSquare, FaRegUser } from 'react-icons/fa';

const SideBar = ({ sidebarOpen, isMobile, isTablet, isDesktop }) => {
  const itemClass = 'flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer';
  const sectionTitleClass = 'text-xs text-gray-500 font-semibold px-2 mt-4 mb-1 uppercase';

  // Sidebar width based on device and open state
  const sidebarWidth = sidebarOpen ? 'w-60' : 'w-0';
  const padding = sidebarOpen ? 'px-4' : 'px-0';
  const contentVisibility = sidebarOpen ? 'block' : 'hidden';
  const transform = !sidebarOpen ? '-translate-x-full' : 'translate-x-0';

  // Adjust sidebar width for desktop when closed
  const minWidth = isDesktop && !sidebarOpen ? '64px' : sidebarOpen ? '240px' : '0';

  return (
    <>
      {/* Overlay for all devices */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        ></div>
      )}

      <nav
        className={`fixed top-14 h-[calc(100vh-56px)] bg-white text-black border-r border-gray-200 transition-all duration-300 ease-in-out ${sidebarWidth} ${padding} py-2 flex flex-col text-xs overflow-y-auto z-50 ${transform}`}
        style={{ minWidth: minWidth }}
      >
        {/* Main Section */}
        <div className="space-y-2">
          <Link to="/" className={itemClass}>
            <IoMdHome size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Home</span>
          </Link>
          <Link to="/shorts" className={itemClass}>
            <SiYoutubeshorts size={18} className="shrink-0" />
            <span className={`${contentVisibility}`}>Shorts</span>
          </Link>
          <Link to="/subscriptions" className={itemClass}>
            <MdSubscriptions size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Subscriptions</span>
          </Link>
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Library Section */}
        <div className="space-y-2">
          <Link to="/library" className={itemClass}>
            <MdOutlineVideoLibrary size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Library</span>
          </Link>
          <Link to="/history" className={itemClass}>
            <RiHistoryLine size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>History</span>
          </Link>
          <Link to="/watch-later" className={itemClass}>
            <MdOutlineWatchLater size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Watch Later</span>
          </Link>
          <Link to="/liked" className={itemClass}>
            <MdThumbUpAlt size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Liked Videos</span>
          </Link>
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Subscriptions */}
        <span className={`${contentVisibility} ${sectionTitleClass}`}>Subscriptions</span>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={itemClass}>
              <FaRegUser size={20} className="shrink-0" />
              <span className={`${contentVisibility}`}>Channel {i + 1}</span>
            </div>
          ))}
          <div className={itemClass}>
            <span className={`${contentVisibility} text-blue-600 font-medium`}>Show more</span>
          </div>
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Explore */}
        <span className={`${contentVisibility} ${sectionTitleClass}`}>Explore</span>
        <div className="space-y-2">
          <div className={itemClass}>
            <MdOutlineShoppingBag size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Shopping</span>
          </div>
          {['Music', 'Films', 'Live', 'Gaming', 'News', 'Sport', 'Courses'].map((item) => (
            <div key={item} className={itemClass}>
              <MdOutlineExplore size={20} className="shrink-0" />
              <span className={`${contentVisibility}`}>{item}</span>
            </div>
          ))}
          <div className={itemClass}>
            <MdOutlinePodcasts size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Podcasts</span>
          </div>
        </div>

        <hr className="my-2 border-gray-200" />

        {/* More from YouTube */}
        <span className={`${contentVisibility} ${sectionTitleClass}`}>More from YouTube</span>
        <div className="space-y-2">
          <div className={itemClass}>
            <FaYoutube size={20} className="text-red-500 shrink-0" />
            <span className={`${contentVisibility}`}>YouTube Premium</span>
          </div>
          <div className={itemClass}>
            <FaYoutubeSquare size={20} className="text-red-500 shrink-0" />
            <span className={`${contentVisibility}`}>YouTube Studio</span>
          </div>
          <div className={itemClass}>
            <FaYoutube size={20} className="text-red-500 shrink-0" />
            <span className={`${contentVisibility}`}>YouTube Music</span>
          </div>
          <div className={itemClass}>
            <FaYoutube size={20} className="text-red-500 shrink-0" />
            <span className={`${contentVisibility}`}>YouTube Kids</span>
          </div>
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Settings */}
        <div className="space-y-2">
          <Link to="/settings" className={itemClass}>
            <MdSettings size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Settings</span>
          </Link>
          <Link to="/report-history" className={itemClass}>
            <IoMdTime size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Report History</span>
          </Link>
          <Link to="/help" className={itemClass}>
            <MdHelpOutline size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Help</span>
          </Link>
          <Link to="/feedback" className={itemClass}>
            <MdOutlineFeedback size={20} className="shrink-0" />
            <span className={`${contentVisibility}`}>Send Feedback</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default SideBar;