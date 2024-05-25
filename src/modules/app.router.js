import categoriesRouter from './categories/categories.router.js';
import subcategoryRouter from './subcategory/subcategory.router.js';
import productsRouter from './products/products.router.js';
import couponRouter from './coupon/coupon.router.js';
import authRouter from './auth/auth.router.js';
import cartRouter from './cart/cart.router.js';
import borrowingRouter from './borrowing/borrowing.router.js';
import orderRouter from './order/order.router.js';
import userRouter from './user/user.router.js';
import connectDB from '../../DB/connection.js';
import { globalerrorhandler } from '../utils/errorHanding.js';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import * as auth from './auth.js';

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
const initapp = async (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  connectDB();
  // app.get('/', (req, res) => {
  //   return res.status(200).json({ message: "Welcome.." });
  // });
  app.use(express.static('./'));
  app.use('/categories', categoriesRouter);
  app.use('/products', productsRouter);
  app.use('/auth', authRouter);
  app.use('/subcategory', subcategoryRouter);
  app.use('/coupon', couponRouter);
  app.use('/cart', cartRouter);
  app.use('/order', orderRouter);
  app.use('/user', userRouter);
  app.use('/borrowing', borrowingRouter);

  app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Sign in with Google</a>');
  });

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));

  app.get('/auth/google/callback',//تأكد من المصادقة
    passport.authenticate('google', {
      successRedirect: '/protected',
      failureRedirect: '/auth/google/failure'
    })
  );

  app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.firstName} ${req.user.lastName}`);
  });

  // app.get('/logout', (req, res) => {
  //   req.logout();
  //   req.session.destroy();
  //   res.send('Goodbye!');
  // });

  app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });

  app.get('*', (req, res) => {
    return res.status(500).json({ message: "Page not found.." });
  });
  app.use(globalerrorhandler);
};

export default initapp;