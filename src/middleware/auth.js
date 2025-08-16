<<<<<<< HEAD
import jwt from 'jsonwebtoken'; // استيراد مكتبة jwt لإنشاء وفك تشفير التوكنات
import userModel from '../../DB/model/user.model.js'; // استيراد نموذج المستخدم من قاعدة البيانات
=======
import jwt from 'jsonwebtoken'; 
import userModel from '../../DB/model/user.model.js'; 
>>>>>>> eadd7a5 (Save current changes before pull)

// تعريف أدوار المستخدمين
export const roles = {
    Admin: 'Admin',
    User: 'User'
};

<<<<<<< HEAD
// دالة للتحقق من صلاحيات المستخدم
export const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers; // استخراج الوصول المصرّح به من رأس الطلب

=======
//  للتحقق من صلاحيات المستخدم
export const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers; // استخراج الوصول المصرّح به من رأس الطلب
>>>>>>> eadd7a5 (Save current changes before pull)
        // التحقق من وجود رأس التصريح بالوصول والبدء بالكود إذا كان موجودًا
        if (!authorization?.startsWith(process.env.BEARERKEY)) {
            return next(new Error("Invalid authorization", { cause: 404 }))
        }
<<<<<<< HEAD

        // استخراج التوكن من رأس التصريح بالوصول
        const token = authorization.split(process.env.BEARERKEY)[1];

=======
        // استخراج التوكن من رأس التصريح بالوصول
        const token = authorization.split(process.env.BEARERKEY)[1];
>>>>>>> eadd7a5 (Save current changes before pull)
        // فك تشفير التوكن والتحقق من صحته
        const decoded = jwt.verify(token, process.env.LOGINSECRET);
        if (!decoded) {
            return next(new Error("Invalid authorization", { cause: 404 }))
        }
<<<<<<< HEAD

        // البحث عن المستخدم باستخدام معرفه الموجود في التوكن
        const user = await userModel.findById(decoded.id).select("lastName firstName role changePasswordTime")

=======
        // البحث عن المستخدم باستخدام معرفه الموجود في التوكن
        const user = await userModel.findById(decoded.id).select("lastName firstName role changePasswordTime")
>>>>>>> eadd7a5 (Save current changes before pull)
        // التحقق من وجود المستخدم
        if (!user) {
            return next(new Error("Not registred user", { Cause: 400 }))
        }
<<<<<<< HEAD

=======
>>>>>>> eadd7a5 (Save current changes before pull)
        // التحقق من صحة التوكن وانتهاء صلاحيته
        if (parseInt(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
            return next(new Error(`expired token, Please login`, { cause: 400 }));
        }
<<<<<<< HEAD

=======
>>>>>>> eadd7a5 (Save current changes before pull)
        // التحقق من أن دور المستخدم مسموح به
        if (!accessRoles.includes(user.role)) {
            return next(new Error("Not authorization user", { Cause: 403 }))
        }
<<<<<<< HEAD

=======
>>>>>>> eadd7a5 (Save current changes before pull)
        // تعيين معلومات المستخدم للطلب لاستخدامها في الوظائف اللاحقة
        req.user = user;
        next(); // المرور إلى الوسيط التالي في سلسلة الوسائط
    }
};
