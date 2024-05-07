import userModel from "../../../DB/model/user.model.js";
import XLSX from "xlsx";
import { createPdf } from "../../utils/pdf.js";
import bcryptjs from "bcryptjs";

export const GetProfile = async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return next(new Error("error while getting profile"));
    }
    return res.status(200).json({ message: "Sucess", user });
};
export const uploadUserExcel = async (req, res, next) => {
    const woorkBook = XLSX.readFile(req.file.path);
    const woorkSheet = woorkBook.Sheets[woorkBook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(woorkSheet);
    if (!(await userModel.insertMany(users))) {
        return next(new Error(`Could not insert`, { cause: 400 }));
    }
    return res.status(201).json({ message: "success" });
};
export const GetUsers = async (req, res, next) => {
    let getUsers = await userModel.find({}).lean();
    await createPdf(getUsers, "listUsers.pdf", req, res);
};
export const UpdatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);
    const match = await bcryptjs.compare(oldPassword, user.password);
    if (!match) {
        return next(new Error("Invalid old password"));
    }
    const hashPassword = await bcryptjs.hash(newPassword, parseInt(process.env.SALTROUND));
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
}

