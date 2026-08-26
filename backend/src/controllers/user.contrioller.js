import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connections.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { json } from "stream/consumers";
import { error, profile } from "console";
import converUserDataTOPDF from "../utils/pdfDocument.util.js";

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const profile = await new Profile({ userId: newUser._id });

    await profile.save();
    res.status(201).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide email and password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");

    await User.findByIdAndUpdate({ _id: user._id }, { token });

    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    user.profilePicture = req.file.filename;
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Profile picture save" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const { email, username } = newUserData;

    const oldUserData = await User.findOne({ $or: [{ email }, { username }] });

    if (oldUserData) {
      if (
        oldUserData ||
        oldUserData.toString(oldUserData._id) !== toString(user._id)
      ) {
        return res.status(400).json({ message: "user already exists" });
      }
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.status(200).json({ message: "user update suscesfull ." });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const profile_to_update = await Profile.findOne({ userId: user._id });

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();

    return res.status(200).json({ message: "profile update successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profile = await Profile.find().populate(
      "userId",
      "name username email profilePicture",
    );
    return res.status(200).json({ allProfile: profile });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture",
    );

    const pdfPath = await converUserDataTOPDF(userProfile);
    return res.sendFile(pdfPath);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { token, connection_id } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found" });

    const connectionUser = await User.findOne({ _id: connection_id });
    if (!connectionUser)
      return res.status(404).json({ message: "connection not found" });

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "request alrady send" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "request send" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnection = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found" });
    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AllMyConnection = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found" });
    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");
    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { token, requestId, action_type } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "user not found" });

    const connection = await ConnectionRequest.findOne({ _id: requestId });
    if (!connection) return res.status(404).json({ message: "user not found" });

    if (action_type == "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "request updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUersProfileAndUserBasedOnUsername = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
