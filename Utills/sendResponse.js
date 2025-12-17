import { generateToken } from "./generateToken.js";

export const sendResponse  =(
    res,
    user,
    statusCode,
    message,
    profile = null
) => {
    const token = generateToken( user?._id);
    const {Password:pass,...rest } = user._doc;
    const responseData = {user: rest};
    if(profile){
        responseData.profile = profile;

    }
        return res
        .status(statusCode)
        .cookie("token",token,{
            maxAge : 1 * 24 * 60 * 60 * 1000,
            httpOnly:true,
            secure:true,
            sameSite:"none",
    })
        .json({
            sucess:true,
            message,
            ...responseData,
        });
};