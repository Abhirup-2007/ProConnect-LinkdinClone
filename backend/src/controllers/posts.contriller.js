import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js"

export const createPosts = async (req, res) => {
  try {
    const { token, body } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found" });
    const newPost = new Post({
      userId: user._id,
      body: body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await newPost.save();
    return res.status(200).json({ message: "Post created" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username profilePicture email",
    );
    return res.status(200).json({ posts: posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) return res.status(404).json({ message: "user not found" });
    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "unauthorized" });
    }
    await Post.deleteOne({ _id: post_id });
    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postComment=async(req,res)=>{
  try {
    const {token ,post_id ,commentBody} = req.body

    const user = await User.findOne({token:token})
    if(!user) return res.status(404).json({message : "user not found"})
    const post = await Post.findOne({_id:post_id})
    if (!post) {
      return res.status(404).json({message : "post not found"})
    }

    const newComment = new Comment({
      userId:user._id,
      postId:post._id,
      body:commentBody
    })

    await newComment.save()

    return res.status(200).json({message:"comment added"})

  } catch (error) {
    return res.status(500).json({message : error.message})
  }
}

export const get_comment_by_post = async(req,res) =>{
  try {
    const {post_id} =  req.query
    const post = await Post.findOne({_id:post_id})
    if(!post) return res.status(404).json({message:"comment not found"})

    const commnets = await Comment.find({postId:post_id}).populate("userId" ,"username name");

    return res.json(commnets.reverse())

  } catch (error) {
    return res.status(500).json({message: "server error"})
  }
} 

export const deleteComment = async(req,res) =>{
  try {
      const {token , comment_id} = req.body
      const user = await User.findOne({token:token}).select("_id");
      if(!user) return res.status(404).json({message : "user not found"})
      const comment = await Comment.findById(comment_id)
      if(!comment) return res.status(404).json({message : "post not found"})
      
      if (comment.userId.toString()!=user._id.toString()) {
         return res.status(401).json({ message: "unauthorized" });
      }

      await Comment.deleteOne({"_id":comment_id})

      return res.status(200).json({message : "comment delete successful"})

  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const Increment_likes = async(req,res)=>{
  try {
    const { post_id } = req.body;

    const post = await Post.findOne({_id:post_id})
    if(!post) return res.status(404).json({message : "post not found"})

      post.likes += 1
      
      await post.save()
      return res.json({message:"likes Incremented"})


  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}