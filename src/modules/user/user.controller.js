import userModel from "../../../DB/model/user.model.js";

export const getProfile = async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return next(new Error("error while getting profile"))
    }
    return res.status(200).json({ message: 'Sucess', user })
};