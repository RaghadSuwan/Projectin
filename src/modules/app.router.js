import categoriesRouter from './categories/categories.router.js';
import subcategoryRouter from './subcategory/subcategory.router.js';
import productsRouter from './products/products.router.js';
import couponRouter from './coupon/coupon.router.js';
import authRouter from './auth/auth.router.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import userRouter from './user/user.router.js';

import connectDB from '../../DB/connection.js';
import { globalerrorhandler } from '../utils/errorHanding.js';
const initapp = async (app, express) => {
  app.use(express.json());
  connectDB();
  app.get('/', (req, res) => {
    return res.status(200).json({ message: "Welcome.." });
  });
  app.use('/categories', categoriesRouter);
  app.use('/products', productsRouter);
  app.use('/auth', authRouter);
  app.use('/subcategory', subcategoryRouter);
  app.use('/coupon', couponRouter);
  app.use('/cart', cartRouter);
  app.use('/order', orderRouter);
  app.use('/user', userRouter);
  app.get('*', (req, res) => {
    return res.status(500).json({ message: "Page not found.." });
  });
  app.use(globalerrorhandler);
};

export default initapp;