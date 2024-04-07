import categoriesRouter from './categories/categories.router.js';
import subcategoryRouter from './subcategory/subcategory.router.js';
import productsRouter from './products/products.router.js';
import authRouter from './auth/auth.router.js';
import connectDB from '../../DB/connection.js';
const initapp = (app, express) => {
  app.use(express.json());
  connectDB();
  app.get('/', (req, res) => {
    return res.status(200).json({ message: "Welcome.." });
  });
  app.use('/categories', categoriesRouter);
  app.use('/products', productsRouter);
  app.use('/auth', authRouter);
  app.use('/subcategory', subcategoryRouter);

  app.get('*', (req, res) => {
    return res.status(500).json({ message: "Page not found.." });
  });
}

export default initapp;