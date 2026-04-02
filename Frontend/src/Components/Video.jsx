import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar'; // 

function Video({
  _id,
  title,
  channel,
  views,
  thumbnail,
  uploadDate,
  videoLink
}) {

  const safeVideoId =
    videoLink && videoLink.length > 5 ? videoLink : "dQw4w9WgXcQ";

  //  SAFE THUMBNAIL
  const thumbnailUrl =
    thumbnail && thumbnail.includes("youtube.com")
      ? thumbnail
      : `https://img.youtube.com/vi/${safeVideoId}/hqdefault.jpg`;

  //  CHECK IF IMAGE EXISTS (kept, but not needed now — safe to keep)
  const hasImage = channel?.channelPic && channel.channelPic !== "";

  //  DYNAMIC COLOR FOR LETTER AVATAR (kept for consistency, though Avatar handles fallback)
  const bgColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500"];
  const color =
    bgColors[
      (channel?.channelName?.charCodeAt(0) || 0) % bgColors.length
    ];

  return (
    <div className="w-full">

      {/* Thumbnail */}
      <Link to={`/video/${_id}`}>
        <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition duration-300 hover:brightness-90"
            onError={(e) => {
              e.target.src = "https://placehold.co/300x180";
            }}
          />
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex gap-3 mt-3">

        {/*  AVATAR (UPDATED TO COMPONENT) */}
        <Link to={`/channels/${channel?._id}`}>
          <Avatar
            src={channel?.channelPic}
            name={channel?.channelName}
            size={36}
          />
        </Link>

        {/* Text Info */}
        <div className="flex flex-col overflow-hidden">

          {/* Title */}
          <Link
            to={`/video/${_id}`}
            className="text-sm font-medium text-gray-900 line-clamp-2"
          >
            {title}
          </Link>

          {/* Channel Name */}
          <Link
            to={`/channels/${channel?._id}`}
            className="text-xs text-gray-600 hover:underline truncate"
          >
            {channel?.channelName || "Unknown Channel"}
          </Link>

          {/* Views + Date */}
          <div className="text-xs text-gray-600">
            {views} views
            {uploadDate && (
              <span className="ml-1">
                •{" "}
                {formatDistanceToNow(new Date(uploadDate), {
                  addSuffix: true,
                }).replace("about ", "")}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Video;