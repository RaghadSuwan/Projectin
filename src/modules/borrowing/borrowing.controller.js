import productModel from "../../../DB/model/product.model.js";
import borrowingModel from "../../../DB/model/borrowing.model.js";

// إنشاء إعارة جديدة
export const Createborrowing = async (req, res, next) => {
    const { productId, startDate } = req.body; // الحصول على معرف المنتج وتاريخ البدء من الطلب

    // حساب endDate بإضافة 30 يومًا إلى startDate
    const start = new Date(startDate);
    const cuurentDate = new Date();
    if (start <= cuurentDate) {
        // إذا كان تاريخ البدء أقل من أو يساوي التاريخ الحالي، إعادة خطأ
        return next(new Error("Start date must be in the future", { cause: 400 }));
    }
    const end = new Date(start);
    end.setDate(start.getDate() + 30); // تعيين تاريخ النهاية بعد 30 يومًا من تاريخ البدء

    const product = await productModel.findById(productId); // البحث عن المنتج في قاعدة البيانات
    if (!product || product.stock <= 0) {
        // إذا لم يتم العثور على المنتج أو لم يكن متاحًا، إعادة خطأ
        return next(new Error("Product not found or not available", { cause: 404 }));
    }

    // إنشاء سجل إعارة جديد
    const borrowing = await borrowingModel.create({
        user_id: req.user._id, // معرف المستخدم الذي قام بالإعارة
        productId,
        start_date: start,
        end_date: end,
        status: "Pending", // حالة الإعارة الابتدائية
    });

    return res
        .status(201)
        .json({ message: "Borrowing created successfully", borrowing }); // إعادة رسالة النجاح مع بيانات الإعارة
};

// الحصول على جميع الإعارات للمستخدم الحالي
export const Getborrowings = async (req, res, next) => {
    const borrowings = await borrowingModel.find({ user_id: req.user._id }); // البحث عن جميع الإعارات للمستخدم الحالي
    if (borrowings.length === 0) {
        // إذا لم يتم العثور على أي إعارات، إعادة خطأ
        return next(new Error("No borrowings found for this user", { cause: 404 }));
    }
    return res.status(200).json({ message: "Success", borrowings }); // إعادة رسالة النجاح مع بيانات الإعارات
};

// إرجاع إعارة
export const Returnborrowing = async (req, res, next) => {
    const { borrowingId } = req.params; // الحصول على معرف الإعارة من المعاملات
    const borrowing = await borrowingModel.findById(borrowingId); // البحث عن الإعارة في قاعدة البيانات
    if (!borrowing) {
        // إذا لم يتم العثور على الإعارة، إعادة خطأ
        return next(new Error("Borrowing not found", { cause: 404 }));
    }
    borrowing.status = "Returned"; // تعيين حالة الإعارة إلى "Returned"
    borrowing.return_date = new Date(); // تعيين تاريخ الإرجاع إلى التاريخ الحالي
    await borrowing.save(); // حفظ التغييرات في قاعدة البيانات

    return res.status(200).json({ message: "Borrowing returned successfully" }); // إعادة رسالة النجاح
};

// إلغاء إعارة
export const Cancelborrowing = async (req, res, next) => {
    const { borrowingId } = req.params; // الحصول على معرف الإعارة من المعاملات
    try {
        // البحث عن الإعارة وتحديث حالتها إلى "Cancelled" إذا لم تكن ملغاة أو مُرجعة مسبقًا
        const borrowing = await borrowingModel.findOneAndUpdate(
            {
                _id: borrowingId,
                user_id: req.user._id,
                status: { $ne: "Cancelled" },
                status: { $ne: "Returned" },
            },
            { status: "Cancelled", return_date: new Date() }, // تعيين حالة الإعارة إلى "Cancelled" وتحديث تاريخ الإرجاع
            { new: true }
        );

        if (!borrowing) {
            // إذا لم يتم العثور على الإعارة أو كانت ملغاة أو مُرجعة مسبقًا، إعادة خطأ
            return next(new Error("Cannot find borrowing or already processed", { cause: 404 }));
        }

        const product = await productModel.findById(borrowing.productId); // البحث عن المنتج في قاعدة البيانات
        if (product) {
            product.stock += 1; // زيادة كمية المنتج في المخزون
            await product.save(); // حفظ التغييرات في قاعدة البيانات
        }

        return res
            .status(200)
            .json({ message: "Borrowing cancelled successfully", borrowing }); // إعادة رسالة النجاح مع بيانات الإعارة
    } catch (error) {
        return next(error); // معالجة أي أخطاء تحدث أثناء العملية
    }
};
