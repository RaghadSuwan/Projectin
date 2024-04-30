import userModel from '../../../DB/model/user.model.js';
import bcryptjs from 'bcryptjs';
import cloudinary from '../../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { sendemail } from '../../utils/email.js';
export const SignUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return next(new Error("email already exists", { cause: 409 }));
    }
    const hashedPassword = await bcryptjs.hash(password, parseInt(process.env.SALT_ROUND));
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `${process.env.APP_NAME}/User`,
        }
    );
    const token = jwt.sign({ email }, process.env.CONFIRMEMAILSECRET, { expiresIn: '1d' });
    await sendemail(
        email,
        "Confirm Email",
        `<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>Verify</a>`
    );
    const createUser = await userModel.create({ userName, email, password: hashedPassword, image: { secure_url, public_id } });
    return res.status(201).json({ message: "Success", user: createUser });
};
export const confirmEmail = async (req, res, next) => {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.CONFIRMEMAILSECRET);
    if (!decodedToken) {
        return next(new Error("Invalid Authorization Token", { cause: 409 }));
    }
    const user = await userModel.findOneAndUpdate(
        { email: decodedToken.email, confirmEmail: false },
        { confirmEmail: true });
    if (!user) {
        return next(new Error("Invalid: Email is already verified or does not exist", { cause: 409 }));
    }
    return res.redirect(process.env.LOGINFRONTEND);
};
export const SignIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error("data invalid", { cause: 400 }));
    }
    if (!user.confirmEmail) {
        return next(new Error("please verify your email", { cause: 400 }));
    }
    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
        return next(new Error("data invalid", { cause: 400 }));
    }
    const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGINSECRET
        // , { expiresIn: '50m' }
    );
    const refreshToken = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGINSECRET, { expiresIn: 60 * 60 * 30 * 24 });

    return res.status(201).json({ message: "Success", token, refreshToken });
};
export const sendCode = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error("user not found!", { cause: 400 }));
    }
    const code = customAlphabet("1234567890", 4)();
    const updatedUser = await userModel.findOneAndUpdate(
        { email },
        { sendCode: code },
        { new: true }
    );
    const html = `<h2>The code is: ${code}</h2>`;
    await sendemail(email, `Reset Password`, html);
    // return res.redirect(process.env.FORGETPASSFRONT);
    return res.status(200).json({ message: "Success", user: updatedUser });
};
export const forgotPassword = async (req, res, next) => {
    const { email, password, code } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return next(new Error("not register account !", { cause: 404 }));
    }
    if (user.sendCode !== code) {
        return next(new Error("invalid code!", { cause: 404 }));
    }
    let match = await bcryptjs.compare(password, user.password);
    if (match) {
        return next(new Error("same password", { cause: 404 }));
    }
    user.password = await bcryptjs.hash(password, parseInt(process.env.SALT_ROUND));
    user.sendCode = null;
    user.changePasswordTime = Date.now();
    await user.save();
    return res.status(200).json({ message: "success" });
};
export const deleteUnConfirmedUsers = async (req, res, next) => {
    const users = await userModel.deleteMany({ confirmEmail: false });
    if (!users) {
        return next(new Error("All users are confirmed", { cause: 400 }))
    }
    return res.status(200).json({ message: success });
}