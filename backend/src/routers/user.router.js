import express from "express"
import upload from "../middlewares/multer.middlewares.js";
import { register,login ,uploadProfilePicture ,
    downloadProfile,getAllUserProfile,updateProfileData, 
    updateProfile ,getUserAndProfile,sendConnectionRequest
    ,getMyConnection , AllMyConnection , acceptConnectionRequest,
    getUersProfileAndUserBasedOnUsername
} 
    from "../controllers/user.contrioller.js";

const router = express.Router();

router.post("/update_profile_picture",upload.single("profile_picture"),uploadProfilePicture)
router.post("/register", register)
router.post("/login", login)
router.post("/update_profile", updateProfile)
router.get("/get_user_and_profile" , getUserAndProfile)
router.post("/update_profile_data" , updateProfileData)
router.get("/user/get_all_users" , getAllUserProfile)
router.get("/user/download_resume", downloadProfile)

router.post("/user/send_connection_request", sendConnectionRequest)
router.get("/user/getConnectionRequests", getMyConnection)
router.get("/user/user_connection_request", AllMyConnection)
router.post("/user/accept_connection_request", acceptConnectionRequest)

router.get("/user/get_uers_profile_and_user_based_on_username",getUersProfileAndUserBasedOnUsername)

export default router;  