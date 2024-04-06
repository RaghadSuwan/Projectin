import userModel from '../../../DB/model/user.model.js';
import bcryptjs from 'bcryptjs';
import cloudinary from '../../services/cloudinary.js';

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
    const createUser = await userModel.create({ userName, email, password: hashedPassword, image: { secure_url, public_id } });
    return res.status(201).json({ message: "Success", user: createUser });
}
export const SignIn = async (req, res) => {
    const {email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: 'data invalid' });
    }
    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
        return res.status(409).json({ message: 'data invalid' });
      }
    return res.status(201).json({ message: "Success", user });
  }
