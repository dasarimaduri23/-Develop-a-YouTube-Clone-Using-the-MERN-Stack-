// Controller for handling video-related operations such as upload, fetch, update, like/dislike, and delete

import VideoModel from '../models/videoModel.js';
import ChannelModel from '../models/channelModel.js';
import UserModel from '../models/usermodel.js';

//--------------------------------------------------------------------------

// Upload a new video (Protected)
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoLink, thumbnail, category } = req.body;

    // Find the channel that belongs to the logged-in user
    const channel = await ChannelModel.findOne({ owner: req.user.id });

    // Create a new video and associate it with the channel
    const video = await VideoModel.create({
      title,
      description,
      videoLink,
      thumbnail,
      category,
      channel: channel._id
    });

    // Add the video ID to the channel's video list
    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//--------------------------------------------------------------------------

// Get all videos (Public Access)
export const getAllVideos = async (req, res) => {
  try {
    const videos = await VideoModel.find().populate('channel');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//--------------------------------------------------------------------------

// Get video by ID, including channel and comments
export const getVideoById = async (req, res) => {
  try {
    const video = await VideoModel.findById(req.params.id)
      .populate('channel')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username avatar' }
      });

    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//--------------------------------------------------------------------------

// Get all videos uploaded by a specific channel
export const getVideosByChannel = async (req, res) => {
  try {
    const videos = await VideoModel.find({ channel: req.params.channelId });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//--------------------------------------------------------------------------

// Delete a video (Protected - Only channel owner can delete)
export const deleteVideo = async (req, res) => {
  try {
    const video = await VideoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const channel = await ChannelModel.findById(video.channel);
    if (channel.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // Delete the video and remove it from the channel's videos array
    await VideoModel.findByIdAndDelete(video._id);
    await ChannelModel.findByIdAndUpdate(channel._id, {
      $pull: { videos: video._id }
    });

    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//----------------------------------------------------------------------

// Like a video (Protected)
export const likeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);
    const user = await UserModel.findById(userId);

    if (!video || !user) return res.status(404).json({ message: "Video or user not found" });

    // Skip if user already liked the video
    if (video.likedBy.includes(userId)) {
      return res.json({ likes: video.likes, dislikes: video.dislikes });
    }

    // Remove user's dislike if previously disliked
    if (video.dislikedBy.includes(userId)) {
      video.dislikedBy.pull(userId);
      video.dislikes = Math.max(0, video.dislikes - 1);
    }

    // Add like
    video.likedBy.push(userId);
    video.likes += 1;

    // Track liked video in user profile
    if (!user.likedVideos) user.likedVideos = [];
    if (!user.likedVideos.includes(video._id)) {
      user.likedVideos.push(video._id);
    }

    await video.save();
    await user.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//----------------------------------------------------------------------

// Unlike a video (Protected)
export const unlikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);
    const user = await UserModel.findById(userId);

    if (!video || !user) return res.status(404).json({ message: "Video or user not found" });

    // Remove like if present
    if (video.likedBy.includes(userId)) {
      video.likedBy.pull(userId);
      video.likes = Math.max(0, video.likes - 1);
    }

    // Remove from user's likedVideos list
    if (user.likedVideos && user.likedVideos.includes(video._id)) {
      user.likedVideos.pull(video._id);
    }

    await video.save();
    await user.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//-------------------------------------------------------------------------------

// Dislike a video (Protected)
export const dislikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);
    const user = await UserModel.findById(userId);

    if (!video || !user) return res.status(404).json({ message: "Video or user not found" });

    // Skip if already disliked
    if (video.dislikedBy.includes(userId)) {
      return res.json({ likes: video.likes, dislikes: video.dislikes });
    }

    // Remove like if previously liked
    if (video.likedBy.includes(userId)) {
      video.likedBy.pull(userId);
      video.likes = Math.max(0, video.likes - 1);
      if (user.likedVideos && user.likedVideos.includes(video._id)) {
        user.likedVideos.pull(video._id);
      }
    }

    // Add dislike
    video.dislikedBy.push(userId);
    video.dislikes += 1;

    await video.save();
    await user.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//--------------------------------------------------------------------------------

// Remove dislike from video (Protected)
export const undislikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove dislike if user had disliked it
    if (video.dislikedBy.includes(userId)) {
      video.dislikedBy.pull(userId);
      video.dislikes = Math.max(0, video.dislikes - 1);
    }

    await video.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//---------------------------------------------------------------------

// Update video details (Protected - Only channel owner)

export const updateVideo = async (req, res) => {
  try {
    const video = await VideoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only allow update if the logged-in user owns the channel
    const channel = await ChannelModel.findById(video.channel);
    if (!channel || channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update only allowed fields if present in request body
    const fields = ["title", "description", "videoLink", "thumbnail", "category"];
    fields.forEach(field => {
      if (req.body[field] !== undefined) video[field] = req.body[field];
    });

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
