import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import UserModal from './UserModel.jsx';
import axios from 'axios';
import { MdClose, MdUpload } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { CiSearch } from 'react-icons/ci';
import { FaBell } from 'react-icons/fa';
import { RiVideoUploadLine } from 'react-icons/ri';
import { BsMic, BsMicMute } from 'react-icons/bs';

function Header({ sidebarOpen, setSidebarOpen, searchedVal, setSearchedVal, onSearch, refreshVideos }) {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);
    const [form, setForm] = useState({
        title: '',
        videoLink: '',
        thumbnail: '',
        description: '',
        category: ''
    });

    // Function to parse YouTube video ID from various input formats
    const parseYouTubeId = (input) => {
        if (!input) return '';
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})|([^"&?/\s]{11})/i;
        const match = input.match(regex);
        return match ? match[1] || match[2] : '';
    };

    const handleSearchInput = (e) => {
        setSearchedVal(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch();
    };

    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchedVal(prev => (prev + ' ' + transcript).trim());
        };
        recognition.onerror = () => setListening(false);

        recognition.start();
    };

    const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        const videoId = parseYouTubeId(form.videoLink);
        if (!videoId) {
            alert("Please enter a valid YouTube video ID or URL.");
            setFormLoading(false);
            return;
        }
        const trimmed = {
            title: form.title.trim(),
            videoLink: videoId,
            thumbnail: form.thumbnail.trim() || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            description: form.description.trim(),
            category: form.category.trim()
        };
        if (!trimmed.title || !trimmed.videoLink) {
            alert("Please fill in all required fields.");
            setFormLoading(false);
            return;
        }
        try {
            await axios.post(
                "http://localhost:8000/api/video",
                trimmed,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert("Video uploaded!");
            setShowUpload(false);
            setForm({
                title: '',
                videoLink: '',
                thumbnail: '',
                description: '',
                category: ''
            });
            // Trigger video list refresh
            if (refreshVideos) refreshVideos();
        } catch (err) {
            alert("Failed to upload video: " + (err.response?.data?.message || err.message));
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <>
            {/* Upload Video Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md text-gray-900 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Upload Video</h2>
                            <button onClick={() => setShowUpload(false)} className="text-gray-600 hover:text-gray-800">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUploadSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Video Title</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    placeholder="Video title"
                                    className="w-full p-2 bg-gray-100 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">YouTube Video ID or URL</label>
                                <input
                                    name="videoLink"
                                    value={form.videoLink}
                                    onChange={handleFormChange}
                                    placeholder="e.g., SqcY0GlETPk or https://www.youtube.com/watch?v=SqcY0GlETPk"
                                    className="w-full p-2 bg-gray-100 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                                <input
                                    name="thumbnail"
                                    value={form.thumbnail}
                                    onChange={handleFormChange}
                                    placeholder="Thumbnail image URL (leave blank for default YouTube thumbnail)"
                                    className="w-full p-2 bg-gray-100 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Video Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    placeholder="Video description"
                                    className="w-full p-2 bg-gray-100 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input
                                    name="category"
                                    value={form.category}
                                    onChange={handleFormChange}
                                    placeholder="Category"
                                    className="w-full p-2 bg-gray-100 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUpload(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
                                    disabled={formLoading}
                                >
                                    <MdClose className="mr-2" /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                                    disabled={formLoading}
                                >
                                    <MdUpload className="mr-2" /> {formLoading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-[2000]">
                    <div className="bg-white rounded-lg p-2 sm:p-4 w-48 sm:w-64">
                        <UserModal setShowModal={setShowModal} onClose={() => setShowModal(false)} />
                    </div>
                </div>
            )}

            {/* Header Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white text-black shadow-sm flex items-center justify-between px-2 sm:px-4 h-14 border-b border-gray-200">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-4 min-w-[120px]">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl hover:bg-gray-100 p-2 rounded-full">
                        <RxHamburgerMenu />
                    </button>
                    <Link to="/" className="flex items-center gap-1">
                        <img src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg" alt="YouTube" className="h-5 md:h-6" />
                    </Link>
                </div>

                {/* Center: Search */}
                <form onSubmit={handleSearchSubmit} className="flex flex-1 justify-center max-w-md md:max-w-2xl">
                    <div className="flex w-full max-w-md md:max-w-xl border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
                        <div className="flex items-center px-3 text-gray-500">
                            <CiSearch className="text-xl" />
                        </div>
                        <input
                            type="text"
                            value={searchedVal}
                            onChange={handleSearchInput}
                            placeholder="Search"
                            className="w-full px-4 py-1 text-sm outline-none text-gray-800 bg-transparent"
                        />
                        {searchedVal && (
                            <button
                                type="button"
                                onClick={() => setSearchedVal('')}
                                className="px-2 text-gray-400 hover:text-gray-600"
                            >
                                &#10005;
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                        >
                            <CiSearch className="text-xl" />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="ml-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                        onClick={handleMicClick}
                    >
                        {listening ? (
                            <BsMicMute className="text-lg text-red-500" />
                        ) : (
                            <BsMic className="text-lg" />
                        )}
                    </button>
                </form>

                {/* Right: Upload + Notifications + User */}
                <div className="flex items-center gap-4 ml-4">
                    {user?.channelId && (
                        <button onClick={() => setShowUpload(true)} className="hover:bg-gray-100 p-2 rounded-full text-xl">
                            <RiVideoUploadLine />
                        </button>
                    )}
                    {user && (
                        <button className="hover:bg-gray-100 p-2 rounded-full text-xl">
                            <FaBell />
                        </button>
                    )}
                    {user ? (
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt="User"
                                onClick={() => setShowModal(v => !v)}
                                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

export default Header;