// استيراد مكتبة Passport لإدارة المصادقة
import passport from 'passport';
// استيراد نموذج المستخدم من قاعدة البيانات
import User from './../../DB/model/user.model.js';
// استيراد استراتيجية Google OAuth 2.0 من مكتبة Passport-Google-OAuth2
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

// الحصول على معرّفات العميل وسر العميل من متغيرات البيئة
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// إعداد استراتيجية Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID, // معرّف العميل
  clientSecret: GOOGLE_CLIENT_SECRET, // سر العميل
  callbackURL: '/auth/google/callback', // عنوان رد الاتصال بعد المصادقة
  passReqToCallback: true, // تمرير الطلب إلى الدالة الراجعة
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    // تحقق مما إذا كان المستخدم موجودًا بالفعل في قاعدة البيانات باستخدام معرّف Google
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // إذا لم يكن المستخدم موجودًا، قم بإنشاء مستخدم جديد باستخدام بيانات الملف الشخصي من Google
      user = await User.create({
        googleId: profile.id, // معرّف Google
        firstName: profile.name.givenName, // الاسم الأول
        lastName: profile.name.familyName, // اسم العائلة
        email: profile.email, // البريد الإلكتروني
        confirmEmail: true, // تعيين تأكيد البريد الإلكتروني إلى true للمستخدمين الجدد
      });
    } else {
      // إذا كان المستخدم موجودًا بالفعل، قم بتحديث تأكيد البريد الإلكتروني إلى true
      user.confirmEmail = true;
      await user.save(); // حفظ التغييرات في قاعدة البيانات
    }

    // تمرير بيانات المستخدم إلى الدالة التالية في سلسلة المصادقة
    return done(null, user);
  } catch (error) {
    // معالجة أي أخطاء تحدث أثناء عملية المصادقة
    console.error(error);
    return done(error);
  }
}));

// دالة تسلسل المستخدم لتخزين بيانات المستخدم في الجلسة
passport.serializeUser(function (user, done) {
  done(null, user);
});

// دالة تسلسل عكسي للمستخدم لاسترجاع بيانات المستخدم من الجلسة
passport.deserializeUser(function (user, done) {
  done(null, user);
});
