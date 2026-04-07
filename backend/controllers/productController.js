const Product = require('../models/Product');
const { sequelize } = require('../config/db');

// ─── GET /api/products — Public ──────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    console.log(`✅ PRODUCTS: Fetched ${products.length} product(s)`);
    return res.status(200).json(products);
  } catch (error) {
    console.error('PRODUCTS_FETCH_ERROR:', error.message);
    return res.status(200).json([]);
  }
};

// ─── POST /api/admin/products — Admin only (supports file upload) ────────────
const createProduct = async (req, res) => {
  try {
    const { title, category, price, stock, image_url } = req.body;

    // Validation
    const errors = [];
    if (!title || String(title).trim().length === 0) errors.push('Title is required');
    if (!category || String(category).trim().length === 0) errors.push('Category is required');
    if (price === undefined || price === null || Number(price) <= 0) errors.push('Price must be greater than 0');
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join('. ') });
    }

    // If a file was uploaded via multer, use its path; otherwise use the URL field
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      title:     String(title).trim(),
      category:  String(category).trim(),
      price:     Number(price),
      stock:     Number(stock) || 0,
      image_url: finalImageUrl,
    });

    console.log(`✅ PRODUCT CREATED: ${product.title} (#${product.id})`);
    return res.status(201).json(product);
  } catch (error) {
    console.error('PRODUCT_CREATE_ERROR:', error.message);
    return res.status(500).json({ message: 'Failed to create product' });
  }
};

// ─── PUT /api/admin/products/:id — Admin only (supports file upload) ─────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { title, category, price, stock, image_url } = req.body;

    const updates = {};
    if (title !== undefined)     updates.title     = String(title).trim();
    if (category !== undefined)  updates.category  = String(category).trim();
    if (price !== undefined) {
      if (Number(price) <= 0) return res.status(400).json({ message: 'Price must be greater than 0' });
      updates.price = Number(price);
    }
    if (stock !== undefined)     updates.stock     = Number(stock);
    if (image_url !== undefined) updates.image_url = image_url || null;

    // If a file was uploaded, override image_url
    if (req.file) {
      updates.image_url = `/uploads/${req.file.filename}`;
    }

    await product.update(updates);
    console.log(`✅ PRODUCT UPDATED: ${product.title} (#${product.id})`);
    return res.status(200).json(product);
  } catch (error) {
    console.error('PRODUCT_UPDATE_ERROR:', error.message);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

// ─── DELETE /api/admin/products/:id — Admin only ─────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const title = product.title;
    await product.destroy();
    console.log(`🗑️ PRODUCT DELETED: ${title} (#${req.params.id})`);
    return res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('PRODUCT_DELETE_ERROR:', error.message);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
