const Product = require('../models/Product');
const { sequelize } = require('../config/db');

const getProducts = async (req, res) => {
  try {
    await sequelize.authenticate(); // Fast check
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    console.log(`✅ PRODUCTS: Fetched ${products.length} product(s)`);
    return res.status(200).json(products);
  } catch (error) {
    console.error('PRODUCTS_FETCH_ERROR:', error.message);
    return res.status(200).json([]); // Return [] so frontend shows fallback
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, category, price, stock, image_url } = req.body;
    const product = await Product.create({ title, category, price, stock, image_url });
    console.log(`✅ PRODUCT CREATED: ${product.title}`);
    return res.status(201).json(product);
  } catch (error) {
    console.error('PRODUCT_CREATE_ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    return res.status(200).json(product);
  } catch (error) {
    console.error('PRODUCT_UPDATE_ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    return res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('PRODUCT_DELETE_ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
