const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sequelize, connectDB } = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Journal = require('./models/Journal');

const seed = async () => {
  await connectDB();

  try {
    await sequelize.sync({ alter: true });

    // Create admin user
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@journeyboutique.com' },
      defaults: {
        name: 'Artisan Admin',
        email: 'admin@journeyboutique.com',
        password: 'Journey123!',
        role: 'admin'
      }
    });
    console.log(adminCreated ? '✅ Admin created' : '✅ Admin already exists');
    console.log('   Email:    admin@journeyboutique.com');
    console.log('   Password: Journey123!');

    // Seed products
    const count = await Product.count();
    if (count === 0) {
      await Product.bulkCreate([
        { title: 'Artisan Leather Collar', category: 'Collars', price: 45.00, stock: 50, image_url: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=800' },
        { title: 'Engraved Brass Tag',     category: 'Tags',    price: 20.00, stock: 120, image_url: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=800' },
        { title: 'Braided Rope Leash',     category: 'Leashes', price: 35.00, stock: 30, image_url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800' },
      ]);
      console.log('✅ Products seeded (3 items)');
    }

    // Seed journal
    const jCount = await Journal.count();
    if (jCount === 0) {
      await Journal.bulkCreate([
        { title: 'Oliver is Walking Better!', date: '2023-11-02', status: 'Success', image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800', content: "We are seeing incredible progress. He took 10 solid steps today without his support harness! The hydrotherapy is working." },
        { title: 'A New Therapy Begins',      date: '2023-10-15', status: 'Challenge', image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800', content: "Today Oliver started his new hydrotherapy protocol. It was a tough morning — he was scared of the water tank at first." },
      ]);
      console.log('✅ Journal seeded (2 entries)');
    }

    console.log('\n🎉 Seeding complete! Run: node backend/server.js');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
    process.exit(1);
  }
};

seed();
