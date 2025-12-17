import User from "../models/user.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../Utills/cloudinary.js";
import { asyncHandler } from "../Utills/asyncHandler.js";
import { ErrorHandler } from "../Utills/errorHandler.js";
import { ApiResponse } from "../Utills/apiResponse.js";
import { generateToken } from "../Utills/generateToken.js";
import { authHashPassword, comparePassword } from "../Utills/passwordHandler.js";
import { sendResponse } from "../Utills/sendResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.model.js";
import Doctor from "../models/doctor.model.js";
import { sendEmail } from "../Utills/sendEmail.js";
import crypto from "crypto";
import Admin from "../models/admin.model.js";
  
// delete all users
export const deleteAllUsers = asyncHandler(async (req, res) => {
  const user = await User.deleteMany({});
  if (!user) {
    res.status(400).json({
      success: false,
      message: "User not deleted",
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: "Users deleted Successfully",
  });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;
  const adminId = req.user?._id;
  let userRole = role || "admin";

  const adminUser = await User.findById(adminId);

  if (adminUser.role === "admin" && (!req.user || req.user.role !== "admin")) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized to create admin account",
    });
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists!" });
  }

  // Hash the password
  const hashPassword = authHashPassword(password);

  // Create new user
  const user = await User.create({
    fullName,
    email,
    password: hashPassword,
    role: userRole,
  });

  // sendResponse(res, user, 201, "User Created Successfully");
  return res.status(200).json({
    success: true,
    message: "User Admin successfully",
    user,
  });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;
  let userRole = role || "patient";

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists!" });
  }

  // Hash the password
  const hashPassword = authHashPassword(password);

  // Create new user
  const user = await User.create({
    fullName,
    email,
    password: hashPassword,
    role: userRole,
  });

  // Create patient profile linked to user
  let profile = null;

  if (userRole === "patient") {
    profile = await Patient.create({ user: user._id });
  }
  sendResponse(res, user, 201, "User Created Successfully");
});

// login user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!password) {
    return res
      .status(404)
      .json({ success: false, message: "Password is required !" });
  }
  if (!email) {
    return res
      .status(404)
      .json({ success: false, message: "Email is required !" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send({
      success: false,
      message: "User does not exists",
    });
  }

  // const isMatch = bcryptjs.compareSync(password, user.password);
  const isMatch = comparePassword(password, user.password);
  if (!isMatch) {
    res.status(400).send({
      success: false,
      message: "Invalid data !",
    });
    // return next(new ErrorHandler("Invalid data", 400));
  }

  sendResponse(res, user, 200, "User log in Successfully");
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200).clearCookie("token", options).json({
    success: true,
    message: "User logged Out",
  });
});

// Helper to get profile by role
const getUserProfileByRole = async (user) => {
  const models = {
    patient: Patient,
    doctor: Doctor,
  };

  const Model = models[user.role];
  if (!Model) return null;

  return Model.findOne({ user: user._id }).populate(
    "user",
    "fullName email role profileImage createdAt"
  );
};

//  Controller to get logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

    // 1️⃣ Fetch user (without password)
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Role-based profile fetching
    let profileData = null;

    if (user.role === "doctor" || user.role === "patient") {
      profileData = await getUserProfileByRole(user);
      if (!profileData) {
        return res.status(404).json({
          success: false,
          message: `${user.role} profile not found`,
        });
      }
    } else if (user.role === "admin") {
      // Admin doesn’t have a separate model — return user info directly
      // profileData = {
      //   _id: user._id,
      //   fullName: user.fullName,
      //   email: user.email,
      //   role: user.role,
      //   profileImage: user.profileImage,
      //   createdAt: user.createdAt,
      // };
      profileData = user;
    } else {
      // For any other roles (if you add more in future)
      profileData = user;
    }

    console.log("profileData :", profileData);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile: profileData,
      user,
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    age,
    gender,
    phone,
    address,
    bloodGroup,
    department,
    qualifications,
    experienceYears,
    availableDays,
    availableTimes,
  } = req.body;

  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ---------------------------
    // Update base user fields
    // ---------------------------
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    const updatedUser = await user.save();

    let updatedProfile = null;

    // ---------------------------
    // PATIENT
    // ---------------------------
    if (user.role === "patient") {
      let updateFields = {};

      if (age !== undefined) updateFields.age = age;
      if (gender !== undefined) updateFields.gender = gender;
      if (phone !== undefined) updateFields.phone = phone;
      if (address !== undefined) updateFields.address = address;
      if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup;

      updatedProfile = await Patient.findOneAndUpdate(
        { user: user._id },
        { $set: updateFields },
        { new: true }
      ).populate("user", "fullName email profileImage role");
    }

    // ---------------------------
    // DOCTOR
    // ---------------------------
    if (user.role === "doctor") {
      let updateFields = {};

      if (age !== undefined) updateFields.age = age;
      if (gender !== undefined) updateFields.gender = gender;
      if (department !== undefined) updateFields.department = department;
      if (qualifications !== undefined)
        updateFields.qualifications = qualifications;
      if (experienceYears !== undefined)
        updateFields.experienceYears = experienceYears;
      if (phone !== undefined) updateFields.phone = phone;
      if (address !== undefined) updateFields.address = address;
      if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup;
      if (availableDays !== undefined)
        updateFields.availableDays = availableDays;
      if (availableTimes !== undefined)
        updateFields.availableTimes = availableTimes;

      updatedProfile = await Doctor.findOneAndUpdate(
        { user: user._id },
        { $set: updateFields },
        { new: true }
      ).populate("user", "fullName email profileImage role");
    }

    // ---------------------------
    // ADMIN (no profile model)
    // ---------------------------
    if (user.role === "admin") {
      updatedProfile = {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
});

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // 🧹 Delete profile image from Cloudinary (if any)
    if (user?.profileImage?.public_id) {
      try {
        await deleteOnCloudinary(user.profileImage.public_id);
      } catch (err) {
        console.warn("Cloudinary deletion failed:", err.message);
      }
    }

    // 🧩 Delete related Doctor or Patient profile
    if (user.role === "doctor") {
      await Doctor.findOneAndDelete({ user: user._id });
    } else if (user.role === "patient") {
      await Patient.findOneAndDelete({ user: user._id });
    }

    // ❌ Delete user account
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
      error: error.message,
    });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user?._id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Find user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old image if exists
    if (user.profileImage?.public_id) {
      await deleteOnCloudinary(user.profileImage.public_id);
    }

    // Upload new image
    const uploadedImage = await uploadOnCloudinary(file.path);
    if (!uploadedImage?.url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // Update user image
    user.profileImage = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.url,
    };
    await user.save();

    // Fetch connected profile only for doctor/patient
    let profile = null;

    if (user.role === "doctor") {
      profile = await Doctor.findOne({ user: user._id }).populate(
        "user",
        "fullName email role profileImage"
      );
    }

    if (user.role === "patient") {
      profile = await Patient.findOne({ user: user._id }).populate(
        "user",
        "fullName email role profileImage"
      );
    }

    // Admin profile = user itself (NO Admin model)
    if (user.role === "admin") {
      profile = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
      profile,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile image",
      error: error.message,
    });
  }
};

const deleteUserProfileByRole = async (user) => {
  const models = { patient: Patient, doctor: Doctor };
  const Model = models[user.role];
  if (!Model) return null;

  return Model.findOneAndDelete({ user: user._id });
};

// Delete logged-in user account
export const deleteProfileAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    //  Delete profile image from Cloudinary if exists
    if (user.profileImage?.public_id) {
      await deleteOnCloudinary(user.profileImage.public_id);
    }

    //  Delete linked profile (Patient/Doctor)
    await deleteUserProfileByRole(user);

    //  Delete the user document
    const deletedUser = await User.findByIdAndDelete(user._id);

    //  Clear auth cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res.clearCookie("token", cookieOptions);

    //  Send response
    return res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting account",
      error: error.message,
    });
  }
};

// admin get users
export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(400).json({
        success: false,
        message: "Data not found",
      });
      return;
    }
    return res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Something wrong with update profile image",
    });
  }
};

// get user account by id admin
export const getUserAccountById = async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(400).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  return res.status(200).json({
    success: true,
    message: "User successfully",
    user,
  });
};

// send link to email for reset password
export const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // For security reasons, don't reveal if the user exists or not
    return res.status(200).json({
      success: true,
      message: "If the email exists, a password reset link has been sent",
    });
  }

  const generateToken = crypto.randomBytes(20).toString("hex");
  if (!generateToken) {
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later",
    });
  }

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(generateToken)
    .digest("hex");

  // expire will be after 15 minutes
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  // Create the frontend reset password URL
  const resetPasswordUrl = `${process.env.FRONTENDAPI}/login?token=${user.resetPasswordToken}`;

  const htmlMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #4F46E5; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
          }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          
          <a href="${resetPasswordUrl}" class="button">Reset Password</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetPasswordUrl}</p>
          
          <p>This link will expire in 15 minutes for security reasons.</p>
          
          <div class="footer">
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Your account security is important to us.</p>
          </div>
        </div>
      </body>
      </html>
    `;

  const data = {
    email: user.email,
    subject: "Password Reset Request",
    message: `Please use the following link to reset your password: ${resetPasswordUrl}`,
    html: htmlMessage, // Add HTML version for email clients
  };
  await sendEmail(data);

  return res.status(200).json({
    success: true,
    message: "If the email exists, a password reset link has been sent",
  });
  sendResponse(res, user, 200, "Password changed successfully");
};

export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset password token is invalid or has been expired",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match!",
      });
    }

    const hashPassword = authHashPassword(password);

    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Passsword update successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error with reseting password",
      error,
    });
  }
};

// for Only Admin can access
export const getUserDetailsByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Find the base user
    const user = await User.findById(userId).select(
      "fullName email role profileImage createdAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profileData = null;

    // 2️⃣ Fetch role-based details
    if (user.role === "patient") {
      profileData = await Patient.findOne({ user: userId }).lean();
    } else if (user.role === "doctor") {
      profileData = await Doctor.findOne({ user: userId }).lean();
    }

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: `${user.role} profile not found`,
      });
    }

    // 3️⃣ Merge user and profile info
    const fullProfile = {
      ...profileData,
      user,
    };

    return res.status(200).json({
      success: true,
      message: `${user.role} details fetched successfully`,
      data: fullProfile,
    });
  } catch (error) {
    console.error("Error fetching user details (admin):", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user details",
    });
  }
};