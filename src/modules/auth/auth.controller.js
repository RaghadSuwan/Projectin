import userModel from '../../../DB/model/user.model.js';
import bcryptjs from 'bcryptjs';
import cloudinary from '../../services/cloudinary.js';
import jwt from 'jsonwebtoken';
import { sendemail } from '../../services/email.js';
export const SignUp = async (req, res) => {
    const { userName, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(409).json({ message: 'email already exists' });
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
}
export const confirmEmail = async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, process.env.CONFIRMEMAILSECRET);
        if (!decodedToken) {
            return res.status(404).json({ message: "Invalid Authorization Token" });
        }
        const user = await userModel.findOneAndUpdate(
            { email: decodedToken.email, confirmEmail: false },
            { confirmEmail: true });
        if (!user) {
            return res.status(400).json({
                message: "Invalid: Email is already verified or does not exist",
            });
        }
        return res.status(200).json({ message: "Your email is verified" });
    } catch (error) {
        console.error("Error in confirmEmail:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const SignIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(409).json({ message: 'data invalid' });
    }
    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
        return res.status(409).json({ message: 'data invalid' });
    }
    const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGINSECRET, { expiresIn: '50m' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.LOGINSECRET, { expiresIn: 60 * 60 * 30 * 24 });

    return res.status(201).json({ message: "Success", token, refreshToken });
}
