const CartItem = require('../models/CartItem');

// ─── GET /api/cart — Get logged-in user's cart ────────────────────────────────
const getCart = async (req, res) => {
  try {
    const items = await CartItem.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(items || []);
  } catch (error) {
    console.error('CART_GET_ERROR:', error.message);
    res.status(200).json([]); // Safe fallback
  }
};

// ─── POST /api/cart — Add item to logged-in user's cart ──────────────────────
const addToCart = async (req, res) => {
  try {
    const {
      product_id, product_title, product_price, image_url,
      category, quantity, finish, engraving_text, phone, size,
    } = req.body;

    const item = await CartItem.create({
      user_id:        req.user.id,
      product_id:     product_id     || null,
      product_title:  product_title  || 'Custom Product',
      product_price:  Number(product_price) || 0,
      image_url:      image_url      || null,
      category:       category       || null,
      quantity:       Number(quantity) || 1,
      finish:         finish         || null,
      engraving_text: engraving_text || null,
      phone:          phone          || null,
      size:           size           || null,
    });

    console.log(`🛒 CART: Added item #${item.id} for user #${req.user.id}`);
    res.status(201).json(item);
  } catch (error) {
    console.error('CART_ADD_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// ─── PUT /api/cart/:id — Update item quantity ────────────────────────────────
const updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    const newQty = Number(req.body.quantity);
    if (newQty < 1) {
      await item.destroy();
      return res.json({ message: 'Item removed from cart' });
    }

    await item.update({ quantity: newQty });
    res.json(item);
  } catch (error) {
    console.error('CART_UPDATE_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

// ─── DELETE /api/cart/:id — Remove item from cart ────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    await item.destroy();
    console.log(`🗑️ CART: Removed item #${req.params.id} for user #${req.user.id}`);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('CART_REMOVE_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
};

// ─── DELETE /api/cart — Clear entire cart ─────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    const count = await CartItem.destroy({ where: { user_id: req.user.id } });
    console.log(`🧹 CART: Cleared ${count} items for user #${req.user.id}`);
    res.json({ message: `Cleared ${count} items` });
  } catch (error) {
    console.error('CART_CLEAR_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};

// ─── POST /api/cart/sync — Merge guest localStorage cart into DB ─────────────
// Called once on login. Takes an array of items from localStorage,
// creates them in the DB, and returns the merged cart.
const syncCart = async (req, res) => {
  try {
    const guestItems = Array.isArray(req.body.items) ? req.body.items : [];

    if (guestItems.length > 0) {
      const toCreate = guestItems.map(item => ({
        user_id:        req.user.id,
        product_id:     item?.product_id     || item?.id || null,
        product_title:  item?.product_title  || item?.title || 'Custom Product',
        product_price:  Number(item?.product_price || item?.price || 0),
        image_url:      item?.image_url      || null,
        category:       item?.category       || null,
        quantity:       Number(item?.quantity) || 1,
        finish:         item?.customDetails?.finish   || item?.finish || null,
        engraving_text: item?.customDetails?.petName  || item?.engraving_text || null,
        phone:          item?.customDetails?.phone    || item?.phone || null,
        size:           item?.customDetails?.size     || item?.size || null,
      }));

      await CartItem.bulkCreate(toCreate);
      console.log(`🔄 CART SYNC: Merged ${toCreate.length} guest items for user #${req.user.id}`);
    }

    // Return the full merged cart
    const cart = await CartItem.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json(cart);
  } catch (error) {
    console.error('CART_SYNC_ERROR:', error.message);
    res.status(500).json({ message: 'Failed to sync cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, syncCart };
