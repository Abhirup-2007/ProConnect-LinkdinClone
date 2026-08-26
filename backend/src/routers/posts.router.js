import express from "express"
import upload from "../middlewares/multer.middlewares.js";
import {createPosts,getAllPosts,deletePost,
    postComment,get_comment_by_post,deleteComment,
    Increment_likes} from "../controllers/posts.contriller.js"
    
const router = express.Router();

router.post("/post",upload.single("media"),createPosts)
router.get("/posts",getAllPosts)
router.delete("/delete_posts",deletePost)
router.post("/comment",postComment)
router.get("/get_all_comment",get_comment_by_post)
router.get("/delete_comment",deleteComment)
router.post("/increment_post_likes",Increment_likes)


export default router;