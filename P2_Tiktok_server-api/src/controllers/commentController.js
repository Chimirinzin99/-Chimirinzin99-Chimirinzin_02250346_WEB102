const dataStore = require('../models');

// GET all comments
const getAllComments = (req, res) => {
  res.status(200).json(dataStore.comments);
};

// GET comment by ID
const getCommentById = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  res.status(200).json(comment);
};

// POST create a new comment
const createComment = (req, res) => {
  const { userId, videoId, text } = req.body;

  if (!userId || !videoId || !text) {
    return res.status(400).json({ error: 'userId, videoId and text are required' });
  }

  const user = dataStore.users.find(u => u.id === parseInt(userId));
  const video = dataStore.videos.find(v => v.id === parseInt(videoId));

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!video) return res.status(404).json({ error: 'Video not found' });

  const newComment = {
    id: dataStore.nextIds.comments++,
    userId: parseInt(userId),
    videoId: parseInt(videoId),
    text,
    likes: [],
    createdAt: new Date().toISOString(),
  };

  dataStore.comments.push(newComment);
  res.status(201).json(newComment);
};

// PUT update a comment
const updateComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required to update comment' });

  comment.text = text;
  comment.updatedAt = new Date().toISOString();

  res.status(200).json(comment);
};

// DELETE a comment
const deleteComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const commentIndex = dataStore.comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) return res.status(404).json({ error: 'Comment not found' });

  dataStore.comments.splice(commentIndex, 1);
  res.status(204).end();
};

// GET comments by user
const getCommentsByUser = (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = dataStore.users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const comments = dataStore.comments.filter(c => c.userId === userId);
  res.status(200).json(comments);
};

// GET comments by video
const getCommentsByVideo = (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const video = dataStore.videos.find(v => v.id === videoId);

  if (!video) return res.status(404).json({ error: 'Video not found' });

  const comments = dataStore.comments.filter(c => c.videoId === videoId);
  res.status(200).json(comments);
};

// POST like a comment
const likeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const userIdInt = parseInt(userId);

  if (!dataStore.users.find(u => u.id === userIdInt))
    return res.status(404).json({ error: 'User not found' });

  if (!comment.likes) comment.likes = [];

  if (comment.likes.includes(userIdInt))
    return res.status(409).json({ error: 'User already liked this comment' });

  comment.likes.push(userIdInt);
  res.status(201).json({ message: 'Comment liked successfully' });
};

// DELETE unlike a comment
const unlikeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  if (!comment.likes) comment.likes = [];

  const likeIndex = comment.likes.indexOf(parseInt(userId));
  if (likeIndex === -1) return res.status(404).json({ error: 'Like not found' });

  comment.likes.splice(likeIndex, 1);
  res.status(204).end();
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByUser,
  getCommentsByVideo,
  likeComment,
  unlikeComment,
};