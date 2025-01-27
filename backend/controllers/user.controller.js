import User from "../models/user.model.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utlis/datauri.js";
import cloudinary from "../utlis/cloudnary.js";
import Post from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "Something went wrong!", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "Try different email!", success: false });
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "Account created successfully.", success: true });
  } catch (error) {
    console.error(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Something went wrong!", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User doest exists register again!", success: false });
    }

    const isPasswordMatch = await bycrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password !", success: false });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
    //to make the site more safe to protect from cross side injection [remember sql injection] maxAge is here 1 day for 10 day just change 1 to 10
  } catch (error) {
    console.error(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password').populate({
      path : 'posts',
      createdAt : -1
    }).populate('bookmarks')
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    
    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found!", success: false });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile Updated", success: true, user });
  } catch (error) {
    console.error(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUsers) {
      return res
        .status(400)
        .json({ message: "Currently do not have any user" });
    }

    return res.status(200).json({ success: true, users: suggestedUsers });
  } catch (error) {
    console.error(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKarneWale = req.id;
    const jiskoFollowKrunga = req.params.id;

    if (followKarneWale === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot follow or unfollow urself",
        success: false,
      });
    }

    const user = await User.findById(followKarneWale);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res
        .status(400)
        .json({ message: "User not found!!", success: false });
    }

    // checking if i can follow or not
    const isFollowing = user.following.includes(jiskoFollowKrunga); //following ek array hai so agar jisko mai follow karta hu usko mai sirf unfollow kar paunga
    if (isFollowing) {
      //here unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWale },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKarneWale } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      //follow logic ,why is there multiple update because if a user A is following user B then they will be but in followers and following
      await Promise.all([
        User.updateOne(
          { _id: followKarneWale },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKarneWale } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "followed successfully", success: true });
    }
  } catch (error) {
    console.error(error);
  }
};
