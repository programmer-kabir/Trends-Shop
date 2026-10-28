const { MongoClient } = require('mongodb');
require('dotenv').config();

const initialCategories = [
  {
    name: "Men's Collection",
    gender: "MEN'S",
    slug: 'mens-collection',
    description: 'Bespoke handcrafted formal shoes, casual loafers, and sport runners for gentlemen.',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { name: "MAN'S FORMAL", description: 'Oxfords, Monk Straps, Brogues and Derbies' },
      { name: "MAN'S CASUAL", description: 'Penny Loafers, Chelsea Boots, Moccasins' },
      { name: "MAN'S SPORT", description: 'Italian Leather Sneakers and Heritage Runners' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    name: "Women's Collection",
    gender: "WOMEN'S",
    slug: 'womens-collection',
    description: 'Sophisticated heels, leather pumps, artisanal mules, and luxury trainers.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { name: "WOMEN'S FORMAL", description: 'Pointed Toe Pumps, Block Heels and Court Shoes' },
      { name: "WOMEN'S CASUAL", description: 'Leather Mules, Loafers and Ankle Boots' },
      { name: "WOMEN'S SPORT", description: 'Platform Trainers and Retro Leather Runners' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    name: "Kid's Collection",
    gender: "KID'S",
    slug: 'kids-collection',
    description: 'Durable, premium leather footwear designed for growing children with orthopedic support.',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { name: "KID'S FORMAL", description: 'Junior Heritage Brogues and Lace-Up Oxfords' },
      { name: "KID'S CASUAL", description: 'Classic Slip-On Loafers and Velcro Ankle Boots' },
      { name: "KID'S SPORT", description: 'All-Terrain Active Trainers and Flexible Speed Runners' }
    ],
    createdAt: new Date().toISOString()
  }
];

async function seedCategories() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://TRENDSSHOP:z2ao1PhZy0lVdpfh@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('TrendsShop');
    await db.collection('categories').deleteMany({});
    const result = await db.collection('categories').insertMany(initialCategories);
    console.log('Categories seeded successfully:', result.insertedCount);
  } finally {
    await client.close();
  }
}

seedCategories();
