const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || (process.env.DB_USER && process.env.DB_PASS ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` : '');

// 15 MAN'S FORMAL PRODUCTS
const formalProducts = [
  {
    name: "Artisan Wholecut Oxford Jet Black",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [39, 40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1512990414788-d97cb4923106?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop",
    price: 4350,
    star: 5,
    Discount: 10,
    selling: 48,
    stock: 35,
    shortDescription: "Seamless wholecut oxford sculpted from a single piece of full-grain Italian calfskin with Goodyear-welted leather sole.",
    Description: {
      Item_code: "TS-MF-101",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Full-Grain Italian Calfskin",
      Sole_material: "Handcrafted Vegetable-Tanned Leather Outsole",
      Color: "Jet Black",
      product: [
        "100% Single-piece wholecut Italian leather",
        "Hand-painted mirror gloss patina on toe cap",
        "Traditional Goodyear-welted construction",
        "Ergonomic memory-foam cushion insole"
      ]
    }
  },
  {
    name: "Classic Cap-Toe Oxford Burnished Mahogany",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    price: 3950,
    star: 5,
    Discount: 15,
    selling: 55,
    stock: 40,
    shortDescription: "Timeless cap-toe silhouette tailored for corporate boardrooms and black-tie ceremonies with hand-burnished mahogany patina.",
    Description: {
      Item_code: "TS-MF-102",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Full-Grain French Veal Leather",
      Sole_material: "Channel-Stitched Leather Sole with Rubber Heel",
      Color: "Mahogany Brown",
      product: [
        "Traditional quintuple eyelet lacing",
        "Reinforced structured cap-toe",
        "Natural calfskin anti-perspirant lining",
        "Shock-absorbing orthopedic cork bed"
      ]
    }
  },
  {
    name: "Double Monk Strap Spanish Calfskin Cognac",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1512990414788-d97cb4923106?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=800&auto=format&fit=crop",
    price: 4250,
    star: 5,
    Discount: 0,
    selling: 42,
    stock: 28,
    shortDescription: "Executive double monk strap shoe with solid brass buckles, hand-stitched toe medallion, and rich antique cognac finish.",
    Description: {
      Item_code: "TS-MF-103",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Spanish Box Calf Leather",
      Sole_material: "Double Leather Outsole with Vibram Heel Tap",
      Color: "Cognac Amber",
      product: [
        "Solid brass adjustable buckles with elasticated stays",
        "Hand-perforated wingtip medallion broguing",
        "Blake-stitched flexible construction",
        "Padded arch support for day-long comfort"
      ]
    }
  },
  {
    name: "Wingtip Brogue Oxford Chestnut Tan",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [39, 40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 3800,
    star: 5,
    Discount: 12,
    selling: 60,
    stock: 45,
    shortDescription: "Heritage full brogue wingtip with intricate punched detailing, hand-stained edge dressings, and premium leather sole.",
    Description: {
      Item_code: "TS-MF-104",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Aniline Finished Full-Grain Leather",
      Sole_material: "Stacked Leather Heel & Outsole",
      Color: "Chestnut Tan",
      product: [
        "Traditional full wingtip perforations and gimping",
        "Burnished toe cap and heel counter",
        "Goodyear storm welt for moisture resistance",
        "Comfort foam inner lining"
      ]
    }
  },
  {
    name: "Adelaide Semi-Brogue Oxford Antique Espresso",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1512990414788-d97cb4923106?q=80&w=800&auto=format&fit=crop",
    price: 4150,
    star: 5,
    Discount: 0,
    selling: 38,
    stock: 25,
    shortDescription: "Distinctive Adelaide u-throat framing around eyelets with refined broguing and deep espresso museum patina.",
    Description: {
      Item_code: "TS-MF-105",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Museum Calfskin Leather",
      Sole_material: "Oak-Bark Tanned Leather Sole",
      Color: "Espresso Brown",
      product: [
        "Graceful Adelaide brogued throat line",
        "Deep mottled marble patina finish",
        "Reinforced heel stiffener for stability",
        "Soft calfskin quarter lining"
      ]
    }
  },
  {
    name: "Tuxedo Patent Leather Oxford Gloss Black",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1512990414788-d97cb4923106?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    price: 4600,
    star: 5,
    Discount: 20,
    selling: 50,
    stock: 30,
    shortDescription: "Ultra-luxurious mirror finish patent leather oxford tailored specifically for galas, evening tuxedos, and wedding receptions.",
    Description: {
      Item_code: "TS-MF-106",
      Brand: "Trends Shop Atelier",
      Upper_Material: "High-Gloss Patent Calf Leather",
      Sole_material: "Hand-Laquered Black Leather Sole",
      Color: "Onyx Black",
      product: [
        "Flawless high-shine patent exterior",
        "Grosgrain silk piping accents",
        "Silky soft crimson quilted lining",
        "Beveled waist dress outsole"
      ]
    }
  },
  {
    name: "Single Monk Strap Medallion Oxford Walnut",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 3750,
    star: 4.9,
    Discount: 10,
    selling: 29,
    stock: 32,
    shortDescription: "Sleek single buckle monk strap with sweeping quarter curves and artisan-chiseled medallion toe.",
    Description: {
      Item_code: "TS-MF-107",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Crust Calf Leather",
      Sole_material: "Vegetable Tanned Leather with Rubber Insert",
      Color: "Walnut Brown",
      product: [
        "Silver-plated custom arched buckle",
        "Chiseled medallion perforated toe",
        "Comfort foam heel insert",
        "Goodyear welted durability"
      ]
    }
  },
  {
    name: "Balmoral Dress Boot Burnished Cognac & Tweed",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    price: 4850,
    star: 5,
    Discount: 15,
    selling: 35,
    stock: 22,
    shortDescription: "Gentleman's Victorian-inspired Balmoral boot combining burnished Italian cognac calfskin with herringbone wool tweed shaft.",
    Description: {
      Item_code: "TS-MF-108",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Full-Grain Leather & British Tweed Wool",
      Sole_material: "Dainite Studded Rubber Sole",
      Color: "Cognac & Tweed",
      product: [
        "Dual-material aristocratic Victorian design",
        "Speed lacing brass eyelets",
        "All-weather Dainite non-slip sole",
        "Full calfskin interior lining"
      ]
    }
  },
  {
    name: "Plain-Toe Derby Oxford Cordovan Oxblood",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=800&auto=format&fit=crop",
    price: 4100,
    star: 5,
    Discount: 10,
    selling: 46,
    stock: 30,
    shortDescription: "Minimalist open-laced Derby sculpted from rich oxblood leather with clean silhouette and supreme flexibility.",
    Description: {
      Item_code: "TS-MF-109",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Full-Grain Waxed Leather",
      Sole_material: "Hand-Crafted Stitched Leather Sole",
      Color: "Deep Oxblood",
      product: [
        "Clean unadorned vamp silhouette",
        "Open-lacing Derby closure for wider arches",
        "Vegetable-tanned footbed with cork fill",
        "Hand-rubbed burgundy undertones"
      ]
    }
  },
  {
    name: "Quarter-Brogue Oxford Dark Midnight Navy",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=800&auto=format&fit=crop",
    price: 4300,
    star: 4.8,
    Discount: 0,
    selling: 25,
    stock: 20,
    shortDescription: "Bespoke midnight navy calfskin oxford with delicate micro-broguing along the cap seam.",
    Description: {
      Item_code: "TS-MF-110",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Hand-Dyed Italian Navy Calfskin",
      Sole_material: "Channel-Stitched Leather Sole",
      Color: "Midnight Navy",
      product: [
        "Unique hand-patinated deep navy hue",
        "Refined micro-perforated cap toe",
        "Narrow chisel last for modern tailoring",
        "Natural leather welt and heel"
      ]
    }
  },
  {
    name: "Chiseled Toe Derby Vintage Amber",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    price: 3650,
    star: 5,
    Discount: 15,
    selling: 39,
    stock: 35,
    shortDescription: "Crisp architectural chisel toe profile in warm amber crust leather, balancing contemporary flair with British heritage.",
    Description: {
      Item_code: "TS-MF-111",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Full-Grain Crust Leather",
      Sole_material: "Hand-Finished Leather Sole",
      Color: "Vintage Amber",
      product: [
        "Sleek square chisel toe geometry",
        "Hand-rubbed shaded gradient polish",
        "Comfort-flex Blake welt",
        "Full leather lining with heel cushion"
      ]
    }
  },
  {
    name: "Executive Chelsea Dress Boot Onyx Black",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [39, 40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 4500,
    star: 5,
    Discount: 10,
    selling: 58,
    stock: 32,
    shortDescription: "Ultra-clean black calfskin Chelsea boot crafted on a formal dress last with beveled leather waist.",
    Description: {
      Item_code: "TS-MF-112",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Italian Box Calf Leather",
      Sole_material: "Leather Outsole with Rubber Half Sole",
      Color: "Onyx Black",
      product: [
        "High-recovery side elastic webbing",
        "Seamless front vamp construction",
        "Woven rear pull tab for effortless entry",
        "Goodyear welted construction"
      ]
    }
  },
  {
    name: "Split-Toe Norwegian Derby Brown Grain",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    price: 4200,
    star: 4.9,
    Discount: 12,
    selling: 31,
    stock: 26,
    shortDescription: "Iconic Norwegian split-toe apron stitched by hand using thick waxed thread with Scottish pebble grain texture.",
    Description: {
      Item_code: "TS-MF-113",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Scottish Pebble-Grain Calfskin",
      Sole_material: "Double Water-Lock Leather Outsole",
      Color: "Pebble Brown",
      product: [
        "Artisanal hand-sewn pie-crust apron",
        "Durable weather-resistant pebble finish",
        "Storm-welt 360-degree stitch",
        "Orthotic support cork footbed"
      ]
    }
  },
  {
    name: "Medallion Cap-Toe Oxford Antique Bourbon",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1512990414788-d97cb4923106?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop",
    price: 4050,
    star: 5,
    Discount: 0,
    selling: 44,
    stock: 36,
    shortDescription: "Hand-glazed bourbon calfskin oxford displaying an ornate starburst medallion over the cap-toe.",
    Description: {
      Item_code: "TS-MF-114",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Full-Grain French Calfskin",
      Sole_material: "Oak Tanned Leather Outsole",
      Color: "Bourbon Tan",
      product: [
        "Intricate starburst toe medallion",
        "Full leather insole with natural arch support",
        "Beveled waist construction",
        "Hand-polished mirror shine finish"
      ]
    }
  },
  {
    name: "Seamless Wholecut Oxford Royal Burgundy",
    category: "MAN'S FORMAL",
    gender: "MEN'S",
    seller: "Trends Shop Bespoke",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    price: 4450,
    star: 5,
    Discount: 15,
    selling: 52,
    stock: 29,
    shortDescription: "Masterpiece wholecut footwear featuring an intoxicating royal burgundy wine patina and violin-waist sole.",
    Description: {
      Item_code: "TS-MF-115",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Single-Piece Crust Calfskin",
      Sole_material: "Violin-Waist Hand-Sewn Leather Sole",
      Color: "Royal Burgundy",
      product: [
        "Rare seamless single-cut construction",
        "Hand-painted wine burgundy depth",
        "Channel-stitched hidden outsole seams",
        "Silky soft calfskin interior lining"
      ]
    }
  }
];

// 15 MAN'S CASUAL PRODUCTS
const casualProducts = [
  {
    name: "Artisan Waxed Camel Suede Chelsea Boot",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [39, 40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop",
    price: 4200,
    star: 5,
    Discount: 0,
    selling: 64,
    stock: 40,
    shortDescription: "Weatherproof waxed suede Chelsea boot with heavy-duty elastic goring, natural crepe outsole, and rugged gentleman styling.",
    Description: {
      Item_code: "TS-MC-101",
      Brand: "Trends Shop Casuals",
      Upper_Material: "English Waxed Calf Suede",
      Sole_material: "Natural Plantation Crepe Sole",
      Color: "Camel Suede",
      product: [
        "Water-repellent waxed reverse suede",
        "Cushioned natural plantation crepe sole",
        "Double-stitched pull tabs for longevity",
        "Breathable leather lining"
      ]
    }
  },
  {
    name: "Venetian Penny Loafer Snuff Suede",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    price: 3350,
    star: 5,
    Discount: 10,
    selling: 50,
    stock: 45,
    shortDescription: "Supple snuff suede slip-on loafer designed for sockless Mediterranean summer strolls and casual chinos.",
    Description: {
      Item_code: "TS-MC-102",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Velvety Italian Calf Suede",
      Sole_material: "Flex Leather Sole with Rubber Inset",
      Color: "Snuff Brown",
      product: [
        "Unlined construction for ultra-soft sockless feel",
        "Traditional hand-sewn beefroll penny strap",
        "Flexible oiled leather outsole",
        "Memory foam heel cup cushion"
      ]
    }
  },
  {
    name: "Horsebit Loafer Burnished Espresso Leather",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 3850,
    star: 5,
    Discount: 15,
    selling: 43,
    stock: 35,
    shortDescription: "Iconic Italian horsebit loafer embellished with antique gold hardware and supple glove-soft calfskin.",
    Description: {
      Item_code: "TS-MC-103",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Full-Grain Glove Calfskin",
      Sole_material: "Hand-Stitched Leather Sole",
      Color: "Espresso Brown",
      product: [
        "Antique gold-plated equestrian horsebit hardware",
        "Moccasin hand-stitched toe wall",
        "Full leather sockliner with gold foil logo",
        "Lightweight flexible Blake construction"
      ]
    }
  },
  {
    name: "Classic Suede Chukka Boot Tobacco Brown",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [39, 40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop",
    price: 3750,
    star: 4.9,
    Discount: 10,
    selling: 36,
    stock: 30,
    shortDescription: "Two-eyelet desert chukka boot in rich tobacco suede, pairing effortlessly with denim and corduroy trousers.",
    Description: {
      Item_code: "TS-MC-104",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Repello Suede with Scotchgard Coating",
      Sole_material: "Dainite Studded Rubber Outsole",
      Color: "Tobacco Suede",
      product: [
        "Stain-resistant Scotchgard treated suede",
        "Minimalist two-eyelet lace closure",
        "Goodyear welt with natural storm welt",
        "Orthopedic supportive shank"
      ]
    }
  },
  {
    name: "Hand-Sewn Driving Moccasin Navy Suede",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 2950,
    star: 5,
    Discount: 15,
    selling: 54,
    stock: 50,
    shortDescription: "Italian style driver shoe with rubber pebble nubs extending up the heel counter for optimal pedal grip and leisure lounging.",
    Description: {
      Item_code: "TS-MC-105",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Italian Navy Split Suede",
      Sole_material: "Segmented Rubber Pebble Sole",
      Color: "Navy Blue",
      product: [
        "Tubular true moccasin construction",
        "Anti-slip studded rubber sole wraps heel",
        "Cushioned leather footbed with arch pod",
        "Tie-knot ornamental bow on vamp"
      ]
    }
  },
  {
    name: "Belgian Loafer Soft Calfskin Jet Black",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 3600,
    star: 5,
    Discount: 0,
    selling: 37,
    stock: 28,
    shortDescription: "Aristocratic Belgian slipper silhouette with discreet mini bow and super-flexible single leather sole.",
    Description: {
      Item_code: "TS-MC-106",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Buttery Nappa Leather",
      Sole_material: "Soft Single Leather Sole",
      Color: "Jet Black",
      product: [
        "Signature Belgian piping and mini bow",
        "Padded leather sock with memory cushioning",
        "Featherlight travel-friendly profile",
        "Smooth unlined glove leather fit"
      ]
    }
  },
  {
    name: "Tassel Loafer Antiqued Cognac Leather",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 3900,
    star: 5,
    Discount: 10,
    selling: 49,
    stock: 35,
    shortDescription: "American Ivy League classic tassel loafer with 360-degree laced collar and hand-woven tassels.",
    Description: {
      Item_code: "TS-MC-107",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Pull-Up Aniline Leather",
      Sole_material: "Double Leather Outsole with Brass Nails",
      Color: "Antique Cognac",
      product: [
        "Hand-knotted leather tassels",
        "Braided side lacing detail",
        "Storm welted heavy duty leather sole",
        "Naturally contours to foot contours"
      ]
    }
  },
  {
    name: "Rugged Commando Lug Chelsea Boot Walnut",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop",
    price: 4400,
    star: 5,
    Discount: 15,
    selling: 56,
    stock: 25,
    shortDescription: "Heavy-duty outdoor Chelsea boot engineered with thick oiled pull-up leather and deep-tread Vibram commando lug sole.",
    Description: {
      Item_code: "TS-MC-108",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Oiled Pull-Up Cowhide Leather",
      Sole_material: "Vibram Commando Deep Lug Rubber",
      Color: "Dark Walnut",
      product: [
        "Weatherproof oil-treated water-beading leather",
        "Heavy-duty Vibram multi-terrain lug outsole",
        "Reinforced triple-stitch stress points",
        "Removable memory foam cushioned footbed"
      ]
    }
  },
  {
    name: "Vintage Boat Shoe Oiled Saddle Brown",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 2850,
    star: 4.8,
    Discount: 10,
    selling: 41,
    stock: 45,
    shortDescription: "Authentic coastal two-eyelet boat shoe with rustproof brass eyelets, rawhide 360-degree laces, and siped non-marking sole.",
    Description: {
      Item_code: "TS-MC-109",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Full-Grain Oiled Leather",
      Sole_material: "Wave-Siped Razor Rubber Sole",
      Color: "Saddle Brown",
      product: [
        "Wave-siping razor cut sole for wet deck traction",
        "Genuine 360 rawhide leather lacing system",
        "Rustproof eyelets and rot-resistant thread",
        "EVA heel cup for shock absorption"
      ]
    }
  },
  {
    name: "Suede Jodhpur Ankle Boot Honey Tan",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    price: 4350,
    star: 5,
    Discount: 0,
    selling: 28,
    stock: 22,
    shortDescription: "Equestrian heritage Jodhpur boot with wrap-around ankle buckle strap and velvet-touch honey suede.",
    Description: {
      Item_code: "TS-MC-110",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Italian Silk Suede",
      Sole_material: "Goodyear-Welted Leather & Rubber Sole",
      Color: "Honey Tan",
      product: [
        "Wrap-around strap with brass roller buckle",
        "Seamless ankle wrap design",
        "Goodyear-welted resolable construction",
        "Full calfskin interior lining"
      ]
    }
  },
  {
    name: "Casual Penny Loafer Distressed Oxblood",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 3450,
    star: 4.9,
    Discount: 10,
    selling: 33,
    stock: 35,
    shortDescription: "Vintage wash oxblood penny loafer featuring distressed character leather that develops a richer patina with every wear.",
    Description: {
      Item_code: "TS-MC-111",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Vegetable-Tanned Pull-Up Leather",
      Sole_material: "Flexible Leather Composite Outsole",
      Color: "Distressed Oxblood",
      product: [
        "Unique pull-up leather lightening characteristics",
        "Hand-stitched apron with waxed cord",
        "Arch-supporting cushioned insole",
        "Non-slip rubber heel protector"
      ]
    }
  },
  {
    name: "Desert Chukka Boot Sand Suede Crepe Sole",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop",
    price: 3500,
    star: 5,
    Discount: 12,
    selling: 45,
    stock: 38,
    shortDescription: "Original 1950s British officer desert boot styling rendered in silky sand suede with virgin plantation crepe sole.",
    Description: {
      Item_code: "TS-MC-112",
      Brand: "Trends Shop Casuals",
      Upper_Material: "English Suede",
      Sole_material: "Natural Crepe Rubber",
      Color: "Sand Beige",
      product: [
        "Lightweight natural shock-absorbing crepe sole",
        "Two-eyelet blind eyelet lacing",
        "Breathable unlined forefoot",
        "Reinforced counter with pull tab"
      ]
    }
  },
  {
    name: "Hand-Woven Leather Slip-On Loafer Walnut",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 3700,
    star: 5,
    Discount: 0,
    selling: 27,
    stock: 25,
    shortDescription: "Bespoke interlaced braided leather slip-on providing maximum summer airflow with luxurious artisanal refinement.",
    Description: {
      Item_code: "TS-MC-113",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Hand-Braided Calf Leather Strips",
      Sole_material: "Leather Sole with Rubber Pods",
      Color: "Walnut Brown",
      product: [
        "Master-woven breathable lattice upper",
        "Supple calfskin lining along heel collar",
        "Lightweight flexible driving sole",
        "Padded leather footbed"
      ]
    }
  },
  {
    name: "Kiltie Tassel Loafer Vintage Burgundy",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    price: 4100,
    star: 4.8,
    Discount: 15,
    selling: 38,
    stock: 30,
    shortDescription: "Extravagant Scottish heritage kiltie fringe loafer with twin leather tassels in deep glazed vintage burgundy.",
    Description: {
      Item_code: "TS-MC-114",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Glazed Calfskin Leather",
      Sole_material: "Goodyear-Welted Stacked Leather Sole",
      Color: "Vintage Burgundy",
      product: [
        "Serrated kiltie tongue overlay with tassels",
        "360-degree braided collar lacing",
        "Substantial double leather outsole",
        "Cork-cushioned shock-dampening interior"
      ]
    }
  },
  {
    name: "Side-Zip Dress Casual Ankle Boot Dark Cocoa",
    category: "MAN'S CASUAL",
    gender: "MEN'S",
    seller: "Trends Shop Atelier",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop",
    price: 4300,
    star: 5,
    Discount: 10,
    selling: 42,
    stock: 28,
    shortDescription: "Modern streamlined side-zip ankle boot with YKK antiqued metal zipper and hand-burnished dark cocoa calfskin.",
    Description: {
      Item_code: "TS-MC-115",
      Brand: "Trends Shop Casuals",
      Upper_Material: "Hand-Burnished Cocoa Calfskin",
      Sole_material: "Dainite Rubber Lug Sole",
      Color: "Dark Cocoa",
      product: [
        "Smooth inner-ankle antique brass YKK zip",
        "Seamless vamp with slim contemporary toe",
        "Weather-resistant storm-welt stitching",
        "Thermal-regulating leather interior"
      ]
    }
  }
];

// 15 MAN'S SPORT PRODUCTS
const sportProducts = [
  {
    name: "Minimalist Italian Leather Court Sneaker White",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [39, 40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=800&auto=format&fit=crop",
    price: 3650,
    star: 5,
    Discount: 10,
    selling: 85,
    stock: 60,
    shortDescription: "Luxury low-profile court sneaker hand-stitched from ultra-clean white Nappa leather with Margom rubber cupsole.",
    Description: {
      Item_code: "TS-MS-101",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Full-Grain Italian Nappa Leather",
      Sole_material: "Margom-Style Italian Rubber Cupsole",
      Color: "Optic White",
      product: [
        "Full-grain buttery Nappa leather upper",
        "360-degree stitched rubber cupsole",
        "Soft calfskin interior with removable orthotic insole",
        "Waxed cotton tonal laces"
      ]
    }
  },
  {
    name: "Heritage Hybrid Runner Carbon & Crimson",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    price: 3950,
    star: 5,
    Discount: 15,
    selling: 78,
    stock: 45,
    shortDescription: "High-performance lifestyle runner pairing carbon-textured leather overlays with responsive high-rebound EVA midsole.",
    Description: {
      Item_code: "TS-MS-102",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Engineered Mesh & Carbon Leather",
      Sole_material: "Multi-Density EVA & Traction Rubber",
      Color: "Carbon Black & Crimson Red",
      product: [
        "Aerodynamic breathability mesh panels",
        "Shock-absorbing high-rebound cushioning",
        "TPU heel clip for lateral stability",
        "Reinforced toe bumper for high mileage"
      ]
    }
  },
  {
    name: "Retro Suede Panelled Trainer Grey & Cream",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    price: 3550,
    star: 4.9,
    Discount: 0,
    selling: 62,
    stock: 40,
    shortDescription: "1970s archival athletic runner silhouette with multi-tone suede overlays, nylon quarter panels, and gum tread.",
    Description: {
      Item_code: "TS-MS-103",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Calf Suede & Ripstop Nylon",
      Sole_material: "Dual-Density EVA with Gum Rubber Tread",
      Color: "Cool Grey & Cream",
      product: [
        "Archival retro athletic paneling",
        "Vintage exposed foam tongue detail",
        "Natural gum rubber herringbone outsole",
        "Cushioned collar and tongue padding"
      ]
    }
  },
  {
    name: "Urban Speed Runner Perforated Triple Black",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 3850,
    star: 5,
    Discount: 10,
    selling: 53,
    stock: 35,
    shortDescription: "Murdered-out monochromatic sneaker built from micro-perforated Italian leather with sculpted aerodynamic chassis.",
    Description: {
      Item_code: "TS-MS-104",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Micro-Perforated Nappa Leather",
      Sole_material: "Sculpted EVA & Anti-Abrasive Rubber",
      Color: "Triple Black",
      product: [
        "Full laser-perforated ventilation forefoot",
        "All-black tactical monochromatic look",
        "Responsive bounce foam cushioning",
        "Reflective rear safety accent strip"
      ]
    }
  },
  {
    name: "High-Top Luxury Leather Court Sneaker White & Grey",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    price: 4100,
    star: 5,
    Discount: 15,
    selling: 47,
    stock: 28,
    shortDescription: "Statement high-top court sneaker inspired by basketball culture, elevated with padded ankle collar and premium leather.",
    Description: {
      Item_code: "TS-MS-105",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Full-Grain Calf Leather & Suede",
      Sole_material: "Stitched Cupsole with Pivot Point Tread",
      Color: "White & Light Grey",
      product: [
        "Padded high-top collar for ankle stabilization",
        "Reinforced eyelet stay and toe perforations",
        "Sidewall stitch for durable longevity",
        "Soft calfskin interior with arch insole"
      ]
    }
  },
  {
    name: "Chunky Sole Hybrid Sneaker Bone & Olive",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    price: 4250,
    star: 5,
    Discount: 0,
    selling: 68,
    stock: 35,
    shortDescription: "Architectural platform chunky sneaker featuring layered olive nubuck, ballistic mesh, and sculpted wave outsole.",
    Description: {
      Item_code: "TS-MS-106",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Nubuck Leather & Ballistic Mesh",
      Sole_material: "Chunky Sculpted Phylon & Rubber Outsole",
      Color: "Bone & Military Olive",
      product: [
        "Dynamic multi-layered wave silhouette",
        "Ergonomic 45mm platform elevation",
        "Padded bellows tongue keeps debris out",
        "High-density memory foam sockliner"
      ]
    }
  },
  {
    name: "Classic Gum Sole Leather Trainer White & Tan",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    price: 3450,
    star: 4.8,
    Discount: 10,
    selling: 51,
    stock: 42,
    shortDescription: "Clean vintage tennis court trainer accented with amber gum sole and gold foil bespoke branding.",
    Description: {
      Item_code: "TS-MS-107",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Smooth Nappa Cowhide",
      Sole_material: "Natural Amber Gum Rubber",
      Color: "White & Gum",
      product: [
        "Durable natural gum non-marking sole",
        "Minimalist gold stamped serial code",
        "Tonal flat cotton lacing",
        "Antibacterial leather insole"
      ]
    }
  },
  {
    name: "Performance Knit Hybrid Runner Jet Black",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 3750,
    star: 5,
    Discount: 15,
    selling: 60,
    stock: 30,
    shortDescription: "Sock-like adaptive circular knit athletic sneaker with stabilizing leather midfoot cage and energy-return sole.",
    Description: {
      Item_code: "TS-MS-108",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Seamless Engineered Circular Knit",
      Sole_material: "Energy-Return Boost Pellet Midsole",
      Color: "Jet Black",
      product: [
        "360-degree anatomical sock-fit collar",
        "Lateral leather lacing harness",
        "Maximum spring energy-return cushioning",
        "Ultra-lightweight featherweight build"
      ]
    }
  },
  {
    name: "All-Terrain Trail Runner Olive & Ochre",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 4300,
    star: 5,
    Discount: 0,
    selling: 40,
    stock: 25,
    shortDescription: "Rugged cross-country trail sneaker equipped with aggressive multidirectional grip cleats and abrasion guard.",
    Description: {
      Item_code: "TS-MS-109",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Weather-Resistant Cordura & Suede",
      Sole_material: "Vibram Megagrip All-Terrain Rubber",
      Color: "Olive & Ochre Gold",
      product: [
        "Vibram Megagrip 5mm chevron lug cleats",
        "Abrasion-resistant Cordura mesh upper",
        "Quick-cinch toggle lacing system",
        "Impact-dispersing rock plate midsole"
      ]
    }
  },
  {
    name: "Monochrome Low-Top Leather Trainer Taupe Grey",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    price: 3600,
    star: 4.9,
    Discount: 10,
    selling: 38,
    stock: 35,
    shortDescription: "Sophisticated neutral taupe calfskin trainer with subtle tonal stitching and understated luxury feel.",
    Description: {
      Item_code: "TS-MS-110",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Fine Italian Nappa Leather",
      Sole_material: "Tone-on-Tone Rubber Cupsole",
      Color: "Taupe Grey",
      product: [
        "Earthy minimalist monochromatic hue",
        "Reinforced heel counter padding",
        "Odor-resistant calf leather lining",
        "Stitched sole perimeter"
      ]
    }
  },
  {
    name: "Classic Tennis Trainer Navy Leather",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=800&auto=format&fit=crop",
    price: 3500,
    star: 5,
    Discount: 12,
    selling: 44,
    stock: 38,
    shortDescription: "Deep navy smooth leather court shoe with contrasting bright white vulcanized sole and breathable perforations.",
    Description: {
      Item_code: "TS-MS-111",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Calfskin Leather",
      Sole_material: "Vulcanized White Rubber",
      Color: "Deep Navy Blue",
      product: [
        "Side ventilation perforation rows",
        "Padded collar prevents heel chafing",
        "High-grip herringbone tread",
        "Pre-shrunk cotton laces"
      ]
    }
  },
  {
    name: "Speed Trainer Perforated Ice White & Cobalt",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    price: 3900,
    star: 5,
    Discount: 15,
    selling: 55,
    stock: 32,
    shortDescription: "Dynamic track-inspired trainer with cobalt blue side strikes and ultralight dual-density foam midsole.",
    Description: {
      Item_code: "TS-MS-112",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Perforated Leather & Suede Trims",
      Sole_material: "Dual-Density Featherlight EVA",
      Color: "Ice White & Cobalt Blue",
      product: [
        "Vibrant cobalt racing stripes",
        "Air-cushioned responsive heel bubble",
        "Flex-groove sole for natural gait cycle",
        "Breathable mesh tongue"
      ]
    }
  },
  {
    name: "Slip-On Minimalist Athletic Sneaker Stealth Black",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [39, 40, 41, 42, 43, 44],
    mainImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 3300,
    star: 4.8,
    Discount: 0,
    selling: 49,
    stock: 40,
    shortDescription: "Laceless slip-on sneaker crafted with elasticated gore panels, glove-leather upper, and flexible rubber sole.",
    Description: {
      Item_code: "TS-MS-113",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Stretch Leather & Elastic Gores",
      Sole_material: "High-Flex Injection Rubber",
      Color: "Stealth Black",
      product: [
        "Effortless hands-free slip-on entry",
        "Clean laceless streamlined silhouette",
        "High-density arch support footbed",
        "Non-slip siped rubber sole"
      ]
    }
  },
  {
    name: "Heritage Cross-Trainer Maroon & Tan",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    price: 3800,
    star: 5,
    Discount: 10,
    selling: 41,
    stock: 30,
    shortDescription: "Classic collegiate aesthetic pairing velvety maroon suede with natural tan leather heel counter and gum outsole.",
    Description: {
      Item_code: "TS-MS-114",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Velour Suede & Saddle Leather",
      Sole_material: "Gum Rubber Waffle Sole",
      Color: "Maroon & Tan",
      product: [
        "Collegiate heritage colorblocking",
        "Waffle-lug gum outsole for timeless traction",
        "Terrycloth cotton lining for plush comfort",
        "Double-stitched stress areas"
      ]
    }
  },
  {
    name: "Reflective Night Runner All-Weather Silver & Black",
    category: "MAN'S SPORT",
    gender: "MEN'S",
    seller: "Trends Shop Athletics",
    size: [40, 41, 42, 43, 44, 45],
    mainImage: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop",
    price: 4400,
    star: 5,
    Discount: 12,
    selling: 53,
    stock: 25,
    shortDescription: "Cutting-edge high-visibility nocturnal running shoe with 3M reflective luminescence and hydro-shield weatherproofing.",
    Description: {
      Item_code: "TS-MS-115",
      Brand: "Trends Shop Athletics",
      Upper_Material: "3M Reflective Technical Fabric & Leather",
      Sole_material: "Hydro-Trek Lug Rubber & Dual EVA",
      Color: "Silver Metallic & Black",
      product: [
        "3M Scotchlite 360-degree night reflectivity",
        "Water-repellent hydro-shield exterior",
        "Anti-torsion TPU midfoot stabilizer",
        "High-density antimicrobial cushioned footbed"
      ]
    }
  }
];

// Combine all 45 products
const all45Products = [
  ...formalProducts.map(p => ({ ...p, cateimg: p.mainImage })),
  ...casualProducts.map(p => ({ ...p, cateimg: p.mainImage })),
  ...sportProducts.map(p => ({ ...p, cateimg: p.mainImage }))
];

async function seed45Shoes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('TrendsShop');
    const shoesCol = db.collection('shoes');

    console.log(`Inserting ${all45Products.length} new luxury footwear products...`);
    const result = await shoesCol.insertMany(all45Products);
    console.log(`Successfully added ${result.insertedCount} products!`);

    const totalCount = await shoesCol.countDocuments();
    console.log(`Total footwear products now in database: ${totalCount}`);

    // Print breakdown
    const formalCount = await shoesCol.countDocuments({ category: "MAN'S FORMAL" });
    const casualCount = await shoesCol.countDocuments({ category: "MAN'S CASUAL" });
    const sportCount = await shoesCol.countDocuments({ category: "MAN'S SPORT" });
    console.log(`Counts -> MAN'S FORMAL: ${formalCount}, MAN'S CASUAL: ${casualCount}, MAN'S SPORT: ${sportCount}`);
  } finally {
    await client.close();
  }
}

seed45Shoes().catch(console.error);
