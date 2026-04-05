const Journal = require('../models/Journal');
const { sequelize } = require('../config/db');

const getJournal = async (req, res) => {
  try {
    await sequelize.authenticate();
    const posts = await Journal.findAll({ order: [['date', 'DESC']] });
    console.log(`✅ JOURNAL: Fetched ${posts.length} post(s)`);
    return res.status(200).json(posts);
  } catch (error) {
    console.error('JOURNAL_FETCH_ERROR:', error.message);
    return res.status(200).json([]); // Return [] — frontend will show demo data
  }
};

const createJournalPost = async (req, res) => {
  try {
    const { title, date, content, image, status } = req.body;
    if (!title || !date || !content || !status) {
      return res.status(400).json({ message: 'Missing required fields: title, date, content, status' });
    }
    const post = await Journal.create({ title, date, content, image, status });
    console.log(`✅ JOURNAL CREATED: "${post.title}"`);
    return res.status(201).json(post);
  } catch (error) {
    console.error('JOURNAL_CREATE_ERROR:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getJournal, createJournalPost };
