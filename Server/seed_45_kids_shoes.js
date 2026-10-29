const { MongoClient } = require('mongodb');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
require('dotenv').config();

const uri = process.env.MONGODB_URI || (process.env.DB_USER && process.env.DB_PASS ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` : '');

// Real Unsplash Kids & Children Footwear Photography Pool
const KIDS_IMG = {
  formalBrogue: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
  maryJaneWhite: 'https://images.unsplash.com/photo-1569953070721-f3d458a64f7f?q=80&w=800&auto=format&fit=crop',
  classicLeather: 'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?q=80&w=800&auto=format&fit=crop',
  toddlerBooties: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
  juniorDress: 'https://images.unsplash.com/photo-1491295314828-fb03946d9b52?q=80&w=800&auto=format&fit=crop',
  toddlerSkater: 'https://images.unsplash.com/photo-1574178508543-2e4041be7edb?q=80&w=800&auto=format&fit=crop',
  kidsConverse: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
  toddlerConverseAnkle: 'https://images.unsplash.com/photo-1583615627073-0067376169cc?q=80&w=800&auto=format&fit=crop',
  rainBoots: 'https://images.unsplash.com/photo-1554995783-571a2b4d923a?q=80&w=800&auto=format&fit=crop',
  kidsHiker: 'https://images.unsplash.com/photo-1573309463328-ec43614b3def?q=80&w=800&auto=format&fit=crop',
  juniorRunner: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop',
  kidsSneakers: 'https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800&auto=format&fit=crop',
  playRunner: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=800&auto=format&fit=crop',
  comfortSport: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop'
};

// 15 KID'S FORMAL PRODUCTS
const formalProducts = [
  {
    name: "Little Gentleman Classic Oxford Brogue Chestnut",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [27, 28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.formalBrogue,
    hoverImage: KIDS_IMG.classicLeather,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.maryJaneWhite,
    price: 2450,
    star: 5,
    Discount: 10,
    selling: 65,
    stock: 35,
    shortDescription: "Tailored children's wingtip Oxford brogue crafted from child-safe vegetable-tanned leather with soft padded collar and orthopedic arch support.",
    Description: {
      Item_code: "TS-KF-101",
      Brand: "Trends Shop Junior",
      Upper_Material: "Non-Toxic Full-Grain Calfskin",
      Sole_material: "Flexible Non-Skid Rubber Dress Sole",
      Color: "Chestnut Brown",
      product: [
        "Traditional decorative laser brogue perforations",
        "Anatomically molded orthopedic arch cushion for growing feet",
        "Non-slip flexible rubber sole ensures playground & party stability",
        "Padded ankle collar prevents blisters during wedding ceremonies"
      ]
    }
  },
  {
    name: "Toddler Duchess Mary Jane Dress Shoe Pearl White",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32],
    mainImage: KIDS_IMG.maryJaneWhite,
    hoverImage: KIDS_IMG.formalBrogue,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.classicLeather,
    price: 2150,
    star: 5,
    Discount: 15,
    selling: 92,
    stock: 40,
    shortDescription: "Charming pearl white Mary Jane featuring an easy hook-and-loop velcro strap, faux mother-of-pearl button, and ultra-soft cushion footbed.",
    Description: {
      Item_code: "TS-KF-102",
      Brand: "Trends Shop Junior",
      Upper_Material: "Supple Kidskin Leather",
      Sole_material: "Soft Flexible Grip Rubber Outsole",
      Color: "Pearl White",
      product: [
        "Hidden quick-release velcro strap disguised under decorative button",
        "Round roomier toe box accommodates healthy toe splay",
        "Anti-slip textured rubber sole prevents slipping on smooth floors",
        "Hypoallergenic breathable leather lining"
      ]
    }
  },
  {
    name: "Junior Patent Leather Formal Court Shoe Onyx Black",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.formalBrogue,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.maryJaneWhite,
    price: 2350,
    star: 5,
    Discount: 10,
    selling: 54,
    stock: 30,
    shortDescription: "High-shine mirror patent formal shoe designed for school recitals, award ceremonies, and formal banquets with anti-scuff toe barrier.",
    Description: {
      Item_code: "TS-KF-103",
      Brand: "Trends Shop Junior",
      Upper_Material: "Glossy Water-Resistant Patent Leather",
      Sole_material: "Durable Non-Marking Neolite Sole",
      Color: "Onyx Black",
      product: [
        "Mirror-finish high-gloss patent leather resists scuffs",
        "Orthopedic high-density latex memory footbed",
        "Seamless inner lining prevents rubbing and hotspots",
        "Formal low stacked heel with anti-shock rubber cap"
      ]
    }
  },
  {
    name: "Royal Velvet Single-Strap Party Shoe Navy Blue",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.juniorDress,
    hoverImage: KIDS_IMG.maryJaneWhite,
    thirdImage: KIDS_IMG.formalBrogue,
    fourthImage: KIDS_IMG.classicLeather,
    price: 2250,
    star: 5,
    Discount: 12,
    selling: 68,
    stock: 32,
    shortDescription: "Regal midnight navy silk velvet party shoe adorned with a miniature grosgrain bow and adjustable gilded velcro buckle strap.",
    Description: {
      Item_code: "TS-KF-104",
      Brand: "Trends Shop Junior",
      Upper_Material: "Plush Velvet & Leather Trims",
      Sole_material: "Ultra-Flexible Gum Rubber Sole",
      Color: "Royal Navy Blue",
      product: [
        "Lustrous royal navy velvet exterior with spill-resistant treatment",
        "Grosgrain bow with secure double-stitch reinforcement",
        "Easy on/off adjustable touch-strap fastener",
        "Flexible outsole bends easily with every natural stride"
      ]
    }
  },
  {
    name: "Heritage Cap-Toe Derby School Shoe Jet Black",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.formalBrogue,
    hoverImage: KIDS_IMG.classicLeather,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.toddlerBooties,
    price: 2550,
    star: 5,
    Discount: 15,
    selling: 88,
    stock: 45,
    shortDescription: "Sturdy British school uniform derby crafted in scuff-resistant boxcalf with reinforced triple-stitched cap toe and all-day comfort.",
    Description: {
      Item_code: "TS-KF-105",
      Brand: "Trends Shop Academy",
      Upper_Material: "Heavy-Duty Scuff-Proof Boxcalf",
      Sole_material: "Cleated Shock-Absorption Rubber Sole",
      Color: "Jet Black",
      product: [
        "Engineered for daily school wear, morning assemblies & playground",
        "Reinforced toe bumper withstands aggressive scuffing",
        "Odor-fighting antimicrobial silver-ion insole lining",
        "Stitched 360-degree storm welt prevents sole separation"
      ]
    }
  },
  {
    name: "Flower-Embellished T-Strap Mary Jane Pastel Blush",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32],
    mainImage: KIDS_IMG.maryJaneWhite,
    hoverImage: KIDS_IMG.juniorDress,
    thirdImage: KIDS_IMG.formalBrogue,
    fourthImage: KIDS_IMG.classicLeather,
    price: 2300,
    star: 5,
    Discount: 10,
    selling: 76,
    stock: 28,
    shortDescription: "Sweet pastel blush T-strap shoe topped with hand-stitched leather blossoms, perfect for flower girls and birthday celebrations.",
    Description: {
      Item_code: "TS-KF-106",
      Brand: "Trends Shop Junior",
      Upper_Material: "Silky Soft Nappa Calfskin",
      Sole_material: "Non-Marking Pink Grip Rubber Sole",
      Color: "Blush Pink",
      product: [
        "Handmade 3D leather flower accents on central T-strap",
        "Breathable leather arch-support footbed prevents flat-foot strain",
        "Anti-slip traction pattern keeps kids safe on polished marble",
        "Easy hook-and-loop closure for independent dressing"
      ]
    }
  },
  {
    name: "Junior Penny Loafer Slip-On Burnished Tan",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.formalBrogue,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.toddlerBooties,
    price: 2400,
    star: 5,
    Discount: 10,
    selling: 70,
    stock: 36,
    shortDescription: "Traditional hand-sewn moc-toe penny loafer in rich cognac tan with elastic hidden instep gussets for hassle-free slip-on.",
    Description: {
      Item_code: "TS-KF-107",
      Brand: "Trends Shop Junior",
      Upper_Material: "Hand-Burnished Pull-Up Leather",
      Sole_material: "Flexible Rubber Driving Pad Sole",
      Color: "Burnished Tan",
      product: [
        "Dual concealed elastic side gussets give easy slip-on fit",
        "Handcrafted authentic moccasin toe seam",
        "Anti-friction padded heel notch stops chafing",
        "Durable non-slip segmented rubber bottom"
      ]
    }
  },
  {
    name: "Wingtip Brogue Lace-Up Dress Shoe Mahogany",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.formalBrogue,
    hoverImage: KIDS_IMG.classicLeather,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.maryJaneWhite,
    price: 2600,
    star: 5,
    Discount: 18,
    selling: 48,
    stock: 25,
    shortDescription: "Miniature bespoke wingtip brogue with hand-stained mahogany patina, waxed round laces, and shock-cushioned rubber sole.",
    Description: {
      Item_code: "TS-KF-108",
      Brand: "Trends Shop Junior",
      Upper_Material: "Full-Grain Italian Calf Leather",
      Sole_material: "Stitched Leather-Look Rubber Outsole",
      Color: "Mahogany Brown",
      product: [
        "Authentic miniature brogue medallion detailing",
        "High arch ergonomic insole supports developing bones",
        "Includes both elastic quick-laces and formal waxed laces",
        "Scuff-resistant hand-burnished protective finish"
      ]
    }
  },
  {
    name: "Toddler Bow-Accent Patent Ballet Flat Ruby Red",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31],
    mainImage: KIDS_IMG.maryJaneWhite,
    hoverImage: KIDS_IMG.juniorDress,
    thirdImage: KIDS_IMG.formalBrogue,
    fourthImage: KIDS_IMG.classicLeather,
    price: 2100,
    star: 5,
    Discount: 10,
    selling: 95,
    stock: 42,
    shortDescription: "Dazzling ruby red patent leather dress flat with instep stay-put elastic bridge and festive bow for parties and holiday galas.",
    Description: {
      Item_code: "TS-KF-109",
      Brand: "Trends Shop Junior",
      Upper_Material: "High-Gloss Spazzolato Patent",
      Sole_material: "Super-Flex Split Rubber Sole",
      Color: "Ruby Red",
      product: [
        "Vibrant candy ruby patent gloss catches the light beautifully",
        "Elastic cross-instep strap ensures the shoe stays on active toddlers",
        "Plush 5mm memory foam footbed feels like walking on air",
        "Reinforced rounded heel cup prevents ankle inward rolling"
      ]
    }
  },
  {
    name: "Junior Double Monk Strap Dress Shoe Dark Walnut",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.formalBrogue,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.toddlerBooties,
    price: 2750,
    star: 5,
    Discount: 12,
    selling: 41,
    stock: 22,
    shortDescription: "Sophisticated double monk strap shoe with polished silver buckles concealing quick velcro fasteners for handsome little gents.",
    Description: {
      Item_code: "TS-KF-110",
      Brand: "Trends Shop Junior",
      Upper_Material: "Smooth Waxed Boxcalf Leather",
      Sole_material: "Channel-Stitched Composite Rubber Sole",
      Color: "Dark Walnut Brown",
      product: [
        "Polished silver buckles with hidden velcro breakaway clips",
        "Cap-toe silhouette with micro-perforated border",
        "Antibacterial breathable leather footbed",
        "Ergonomic heel counter stabilizes growing gait"
      ]
    }
  },
  {
    name: "Formal Chelsea Ankle Boot Deep Chocolate",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.toddlerBooties,
    hoverImage: KIDS_IMG.formalBrogue,
    thirdImage: KIDS_IMG.classicLeather,
    fourthImage: KIDS_IMG.juniorDress,
    price: 2850,
    star: 5,
    Discount: 15,
    selling: 62,
    stock: 30,
    shortDescription: "Sleek ankle boot in rich chocolate calfskin with elastic side gores and full-length inner zip for fast dressing before events.",
    Description: {
      Item_code: "TS-KF-111",
      Brand: "Trends Shop Junior",
      Upper_Material: "Oiled Full-Grain Calfskin",
      Sole_material: "Non-Slip Rubber Lug Sole",
      Color: "Deep Chocolate Brown",
      product: [
        "Interior safety zipper with soft leather flap guards skin",
        "Flexible stretch side gore gives freedom at the ankle joint",
        "Water-resistant sealed welt construction",
        "Contoured arch support prevents foot fatigue"
      ]
    }
  },
  {
    name: "Dainty Pearl Buckle Ballerina Flat Ivory Cream",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32],
    mainImage: KIDS_IMG.maryJaneWhite,
    hoverImage: KIDS_IMG.juniorDress,
    thirdImage: KIDS_IMG.formalBrogue,
    fourthImage: KIDS_IMG.classicLeather,
    price: 2200,
    star: 5,
    Discount: 10,
    selling: 84,
    stock: 38,
    shortDescription: "Graceful ivory ballerina shoe decorated with a cluster of simulated freshwater pearls on an adjustable soft leather strap.",
    Description: {
      Item_code: "TS-KF-112",
      Brand: "Trends Shop Junior",
      Upper_Material: "Silky Pearlescent Lamb Nappa",
      Sole_material: "Non-Skid Rubber Pod Sole",
      Color: "Ivory Cream",
      product: [
        "Securely hand-riveted pearl cluster brooch on instep",
        "Featherlight construction allows natural barefoot-like walking",
        "Cushioned heel pillow eliminates friction blisters",
        "Hypoallergenic organic leather footbed"
      ]
    }
  },
  {
    name: "Junior Kiltie Tassel Dress Loafer Burgundy",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.formalBrogue,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.maryJaneWhite,
    price: 2500,
    star: 5,
    Discount: 15,
    selling: 50,
    stock: 26,
    shortDescription: "Vintage prep kiltie fringed tassel loafer in deep burnished burgundy leather, ideal for weddings and holiday photoshoots.",
    Description: {
      Item_code: "TS-KF-113",
      Brand: "Trends Shop Junior",
      Upper_Material: "Hand-Burnished Calf Leather",
      Sole_material: "Durable Flexible Rubber Outsole",
      Color: "Burgundy Wine",
      product: [
        "Heritage kiltie fringe with twin hand-rolled tassels",
        "Full leather sockliner with heel gel cushion pod",
        "Reinforced toe box protects toes from accidental stubs",
        "Flexible moccasin sole adapts to active children"
      ]
    }
  },
  {
    name: "Glossy Patent School Loafer Midnight Black",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.juniorDress,
    hoverImage: KIDS_IMG.classicLeather,
    thirdImage: KIDS_IMG.formalBrogue,
    fourthImage: KIDS_IMG.maryJaneWhite,
    price: 2350,
    star: 5,
    Discount: 10,
    selling: 78,
    stock: 40,
    shortDescription: "Approved for top school uniform codes, featuring wipe-clean patent leather, an anti-scuff toe, and high-traction rubber bottom.",
    Description: {
      Item_code: "TS-KF-114",
      Brand: "Trends Shop Academy",
      Upper_Material: "High-Gloss Wipe-Clean Patent",
      Sole_material: "Heavy-Duty All-Weather Rubber Sole",
      Color: "Midnight Black",
      product: [
        "Effortless wipe-clean surface repels mud and rain water",
        "Compliant with strict school uniform dress codes",
        "Anti-fungal memory foam insole keeps feet fresh all school day",
        "Double-stitched stress zones withstand playground play"
      ]
    }
  },
  {
    name: "Junior Ceremonial Page-Boy Oxford Caramel",
    category: "KID'S FORMAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [27, 28, 29, 30, 31, 32, 33, 34],
    mainImage: KIDS_IMG.formalBrogue,
    hoverImage: KIDS_IMG.classicLeather,
    thirdImage: KIDS_IMG.juniorDress,
    fourthImage: KIDS_IMG.toddlerBooties,
    price: 2650,
    star: 5,
    Discount: 20,
    selling: 58,
    stock: 24,
    shortDescription: "Exquisite wholecut ceremonial Oxford in golden caramel leather, designed specifically for page boys, ring bearers, and eid festivals.",
    Description: {
      Item_code: "TS-KF-115",
      Brand: "Trends Shop Junior",
      Upper_Material: "Vegetable-Tanned Italian Leather",
      Sole_material: "Buffed Leather Sole with Grip Rubber Center",
      Color: "Golden Caramel",
      product: [
        "Seamless wholecut upper with laser perforated medalion",
        "Padded orthopedic ankle cup supports steady walking",
        "Includes spare pair of ribbon dress laces",
        "100% chromium-free child-safe tanning process"
      ]
    }
  }
];

// 15 KID'S CASUAL PRODUCTS
const casualProducts = [
  {
    name: "Easy-Velcro Soft Leather Sneaker Navy & White",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.toddlerSkater,
    hoverImage: KIDS_IMG.toddlerConverseAnkle,
    thirdImage: KIDS_IMG.kidsConverse,
    fourthImage: KIDS_IMG.kidsHiker,
    price: 1950,
    star: 5,
    Discount: 15,
    selling: 110,
    stock: 55,
    shortDescription: "Everyday staple shoe featuring dual wide velcro straps for independence, soft padded tongue, and non-marking rubber cupsole.",
    Description: {
      Item_code: "TS-KC-101",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Soft Tumbled Cow Leather",
      Sole_material: "Non-Marking Natural Rubber Cupsole",
      Color: "Navy Blue & Clean White",
      product: [
        "Dual wide velcro straps let kids put on shoes themselves",
        "Reinforced rubber toe bumper protects leather when crawling/playing",
        "Removable washable footbed with growth guide lines",
        "Flexible lightweight cupsole absorbs playground impacts"
      ]
    }
  },
  {
    name: "Toddler Flexible Moccasin Driving Shoe Camel",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.toddlerBooties,
    thirdImage: KIDS_IMG.toddlerSkater,
    fourthImage: KIDS_IMG.kidsHiker,
    price: 1850,
    star: 5,
    Discount: 10,
    selling: 95,
    stock: 45,
    shortDescription: "Ultra-supple slip-on driving moccasin in velvety camel leather with wrap-around rubber traction studs for early walkers.",
    Description: {
      Item_code: "TS-KC-102",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Velvety Nubuck Leather",
      Sole_material: "Flexible Rubber Driving Pebbles",
      Color: "Camel Tan",
      product: [
        "Tubular moccasin build mimics healthy barefoot movement",
        "Pebble rubber studs wrap heel for car seat protection",
        "Elastic hidden collar guarantees shoe stays firmly on foot",
        "Breathable leather lining wicks tiny feet moisture"
      ]
    }
  },
  {
    name: "Junior Classic Canvas Low-Top Skater Black & White",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [27, 28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.toddlerSkater,
    hoverImage: KIDS_IMG.toddlerConverseAnkle,
    thirdImage: KIDS_IMG.kidsConverse,
    fourthImage: KIDS_IMG.rainBoots,
    price: 1750,
    star: 5,
    Discount: 10,
    selling: 130,
    stock: 60,
    shortDescription: "Iconic timeless low-top skater shoe crafted from durable 12oz cotton canvas with vulcanized waffle grip and padded collar.",
    Description: {
      Item_code: "TS-KC-103",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Heavyweight 12oz Breathable Canvas",
      Sole_material: "Vulcanized Waffle Grip Rubber",
      Color: "Black & Pure White",
      product: [
        "Legendary skate heritage silhouette scaled down for kids",
        "Grippy diamond gum waffle sole prevents skateboard slips",
        "Double-stitched canvas upper withstands sandbox play",
        "Elastic tongue straps hold shape even when tied loosely"
      ]
    }
  },
  {
    name: "Adventure Puddle-Proof Yellow Rain Boot",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.rainBoots,
    hoverImage: KIDS_IMG.kidsHiker,
    thirdImage: KIDS_IMG.toddlerBooties,
    fourthImage: KIDS_IMG.toddlerSkater,
    price: 1650,
    star: 5,
    Discount: 15,
    selling: 115,
    stock: 50,
    shortDescription: "100% waterproof natural rubber rain wellie with built-in pull handles, reflective safety heel strip, and deep mud-clearing lugs.",
    Description: {
      Item_code: "TS-KC-104",
      Brand: "Trends Shop Little Explorer",
      Upper_Material: "100% Natural Flexible Rubber",
      Sole_material: "Self-Cleaning Deep Lug Rubber Tread",
      Color: "Bright Sunshine Yellow",
      product: [
        "Large molded easy-carry handles help toddlers pull on boots",
        "100% waterproof seamless vulcanized construction",
        "High-visibility 3M reflective patch on heel for dark rainy days",
        "Cozy cotton-terry sweat-absorbing lining"
      ]
    }
  },
  {
    name: "Twin-Gore Elastic Leather Slip-On Olive Sage",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [27, 28, 29, 30, 31, 32, 33, 34],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.toddlerSkater,
    thirdImage: KIDS_IMG.kidsHiker,
    fourthImage: KIDS_IMG.toddlerBooties,
    price: 2100,
    star: 5,
    Discount: 12,
    selling: 72,
    stock: 35,
    shortDescription: "Sophisticated casual slip-on in earthy sage green leather with stretchy side panels and shock-absorbing crepe textured outsole.",
    Description: {
      Item_code: "TS-KC-105",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Full-Grain Waxed Cowhide",
      Sole_material: "Cushioned Crepe-Texture Rubber Sole",
      Color: "Olive Sage Green",
      product: [
        "Dual elastic side gores allow instant slide-on comfort",
        "Earthy vegetable-dyed soft leather develops nice patina",
        "Anti-microbial moisture-wicking removable insole",
        "Wide toe-box lets toes wiggle freely during playtime"
      ]
    }
  },
  {
    name: "Junior High-Top Canvas Street Sneaker Cherry Red",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [27, 28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.kidsConverse,
    hoverImage: KIDS_IMG.toddlerConverseAnkle,
    thirdImage: KIDS_IMG.toddlerSkater,
    fourthImage: KIDS_IMG.rainBoots,
    price: 1850,
    star: 5,
    Discount: 15,
    selling: 102,
    stock: 48,
    shortDescription: "Classic vintage basketball high-top in energetic cherry red canvas with side zipper, white rubber toe cap, and ankle star badge.",
    Description: {
      Item_code: "TS-KC-106",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Durable Breathable Cotton Canvas",
      Sole_material: "Vulcanized Rubber Toe & Outsole",
      Color: "Cherry Red & White",
      product: [
        "Inner side zipper allows quick entry without untying laces",
        "Classic white protective rubber toe cap prevents bruising",
        "High-top padded ankle support protects active feet",
        "Contoured arch pillow supports long walking trips"
      ]
    }
  },
  {
    name: "Cushioned Leather Fisherman Sandal Honey Brown",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32],
    mainImage: KIDS_IMG.toddlerBooties,
    hoverImage: KIDS_IMG.classicLeather,
    thirdImage: KIDS_IMG.toddlerSkater,
    fourthImage: KIDS_IMG.kidsHiker,
    price: 1950,
    star: 5,
    Discount: 10,
    selling: 88,
    stock: 40,
    shortDescription: "Closed-toe caged leather summer sandal that protects toes from rocks while keeping feet well ventilated with adjustable velcro ankle.",
    Description: {
      Item_code: "TS-KC-107",
      Brand: "Trends Shop Little Explorer",
      Upper_Material: "Oiled Full-Grain Waxed Leather",
      Sole_material: "Flexible Slip-Resistant Rubber Outsole",
      Color: "Honey Brown",
      product: [
        "Caged closed toe protects little toes at parks and playgrounds",
        "Generous ventilation slits prevent sweaty feet in summer",
        "Velcro ankle strap with pull tab for fast self-dressing",
        "Soft suede-lined insole cushions every step"
      ]
    }
  },
  {
    name: "Toddler Ankle Chelsea Bootie Tan Suede",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32],
    mainImage: KIDS_IMG.toddlerBooties,
    hoverImage: KIDS_IMG.classicLeather,
    thirdImage: KIDS_IMG.kidsHiker,
    fourthImage: KIDS_IMG.toddlerSkater,
    price: 2200,
    star: 5,
    Discount: 18,
    selling: 79,
    stock: 35,
    shortDescription: "Adorable mini Chelsea bootie cut from velvety water-repellent tan suede with side zipper and flexible non-slip gum sole.",
    Description: {
      Item_code: "TS-KC-108",
      Brand: "Trends Shop Junior",
      Upper_Material: "Water-Repellent Baby Suede",
      Sole_material: "Flexible Natural Gum Rubber Sole",
      Color: "Tan Camel",
      product: [
        "Inside zip with velcro keeper flap prevents accidental unzipping",
        "Tonal elastic outside gore expands as toddler foot flexes",
        "Scotchgard treated suede resists puddle splashes and dust",
        "Extra-soft shearling-padded insole"
      ]
    }
  },
  {
    name: "Junior Casual Chukka Desert Boot Sand Khaki",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.kidsHiker,
    hoverImage: KIDS_IMG.toddlerBooties,
    thirdImage: KIDS_IMG.classicLeather,
    fourthImage: KIDS_IMG.toddlerSkater,
    price: 2300,
    star: 5,
    Discount: 10,
    selling: 64,
    stock: 30,
    shortDescription: "Smart two-eyelet desert boot featuring sand khaki leather, contrast welt stitching, and ultra-springy crepe rubber sole.",
    Description: {
      Item_code: "TS-KC-109",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Supple Suede Calfskin",
      Sole_material: "Natural Crepe Cushion Outsole",
      Color: "Sand Khaki",
      product: [
        "Classic desert boot profile pairs smartly with khakis & jeans",
        "Bouncy crepe rubber sole cushions hard pavement impact",
        "Reinforced double-stitched heel counter ensures longevity",
        "Wide rounded toe last accommodates growing feet"
      ]
    }
  },
  {
    name: "Breathable Mesh Slip-On Playground Shoe Lilac",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.playRunner,
    hoverImage: KIDS_IMG.toddlerSkater,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.comfortSport,
    price: 1550,
    star: 5,
    Discount: 10,
    selling: 140,
    stock: 65,
    shortDescription: "Ultra-breathable sock sneaker in pastel lilac knit that weighs practically nothing, machine-washable for playground mud.",
    Description: {
      Item_code: "TS-KC-110",
      Brand: "Trends Shop Everyday",
      Upper_Material: "3D Air-Engineered Stretch Knit",
      Sole_material: "Featherlight EVA Injection Sole",
      Color: "Pastel Lilac Purple",
      product: [
        "Pull-on ribbed elastic collar requires zero tying or buckle fuss",
        "Honeycomb airflow knit keeps feet cool on sunny afternoons",
        "100% Machine washable on gentle cycle for easy cleaning",
        "Shock-absorbing curved EVA sole"
      ]
    }
  },
  {
    name: "Outdoor Explorer Leather Hiker Dark Olive",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.kidsHiker,
    hoverImage: KIDS_IMG.toddlerBooties,
    thirdImage: KIDS_IMG.classicLeather,
    fourthImage: KIDS_IMG.rainBoots,
    price: 2450,
    star: 5,
    Discount: 15,
    selling: 55,
    stock: 28,
    shortDescription: "Rugged mini hiking boot with water-resistant leather, rust-free D-ring speed eyelets, padded collar, and heavy lug sole.",
    Description: {
      Item_code: "TS-KC-111",
      Brand: "Trends Shop Little Explorer",
      Upper_Material: "Waterproof Waxed Leather & Cordura",
      Sole_material: "All-Terrain Commando Lug Rubber",
      Color: "Dark Olive Green",
      product: [
        "Multi-directional deep traction lugs grip mud, grass & rocks",
        "Padded bellows tongue keeps trail pebbles and sand out",
        "Cushioned high-density ankle support prevents ankle rolls",
        "Speed-lacing hooks with heavy-duty nylon laces"
      ]
    }
  },
  {
    name: "Crisscross Strap Comfort Leather Sandal Navy",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.toddlerBooties,
    thirdImage: KIDS_IMG.toddlerSkater,
    fourthImage: KIDS_IMG.rainBoots,
    price: 1850,
    star: 5,
    Discount: 12,
    selling: 84,
    stock: 42,
    shortDescription: "Summer slide sandal featuring dual adjustable velcro straps, molded cork-latex footbed, and water-friendly navy leather.",
    Description: {
      Item_code: "TS-KC-112",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Water-Friendly Oiled Leather",
      Sole_material: "Anatomical Cork & Lightweight EVA",
      Color: "Navy Blue",
      product: [
        "Two fully adjustable velcro straps fit wide or narrow feet",
        "Anatomically molded cork footbed supports natural arch growth",
        "Suede-lined topbed prevents foot slippage when damp",
        "Shock-absorbing ripple EVA sole"
      ]
    }
  },
  {
    name: "Toddler Warm Shearling-Lined Bootie Chestnut",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31],
    mainImage: KIDS_IMG.toddlerBooties,
    hoverImage: KIDS_IMG.kidsHiker,
    thirdImage: KIDS_IMG.classicLeather,
    fourthImage: KIDS_IMG.toddlerSkater,
    price: 2250,
    star: 5,
    Discount: 15,
    selling: 90,
    stock: 35,
    shortDescription: "Cloud-soft winter slip-on bootie lined with plush faux shearling fleece to keep tiny toes toasty in cold breezes.",
    Description: {
      Item_code: "TS-KC-113",
      Brand: "Trends Shop Junior",
      Upper_Material: "Heavyweight Suede Calfskin",
      Sole_material: "Flexible Treaded EVA Sole",
      Color: "Chestnut Brown",
      product: [
        "100% Thermal faux shearling lining surrounds foot in warmth",
        "Easy pull-on silhouette with rear loop",
        "Treated suede outer shields from winter mist and drizzle",
        "Treaded sole prevents winter morning slips"
      ]
    }
  },
  {
    name: "Color-Block Casual Low-Top Sneaker Sky Blue & Grey",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [27, 28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.toddlerSkater,
    hoverImage: KIDS_IMG.kidsConverse,
    thirdImage: KIDS_IMG.toddlerConverseAnkle,
    fourthImage: KIDS_IMG.comfortSport,
    price: 1800,
    star: 5,
    Discount: 10,
    selling: 105,
    stock: 52,
    shortDescription: "Playful modern low-top sneaker featuring dynamic color blocking, breathable canvas panels, and flexible toe flex-grooves.",
    Description: {
      Item_code: "TS-KC-114",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Cotton Canvas & Suede Overlays",
      Sole_material: "Non-Marking Gum Rubber Outsole",
      Color: "Sky Blue & Heather Grey",
      product: [
        "Playful pastel color blocking pairs with shorts and dungarees",
        "Flexible rubber sole with forefoot grooves for easy running",
        "Padded mesh collar and tongue for friction-free comfort",
        "Includes both elastic quick-laces and regular laces"
      ]
    }
  },
  {
    name: "Lightweight Slip-On Espadrille Flat Oatmeal",
    category: "KID'S CASUAL",
    gender: "KID'S",
    seller: "Trends Shop Kids",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.classicLeather,
    hoverImage: KIDS_IMG.toddlerSkater,
    thirdImage: KIDS_IMG.toddlerBooties,
    fourthImage: KIDS_IMG.rainBoots,
    price: 1650,
    star: 5,
    Discount: 10,
    selling: 78,
    stock: 38,
    shortDescription: "Breezy summer flat crafted with natural oatmeal linen canvas, braided jute midsole, and vulcanized non-slip rubber bottom.",
    Description: {
      Item_code: "TS-KC-115",
      Brand: "Trends Shop Everyday",
      Upper_Material: "Pure Organic Linen Canvas",
      Sole_material: "Braided Jute & Rubber Composite",
      Color: "Oatmeal Cream",
      product: [
        "Natural organic linen keeps feet cool and sweat-free",
        "Elastic V-notch on instep gives effortless slip-on fit",
        "Water-sealed rubber bottom protects jute from damp ground",
        "Soft cotton-cushioned footbed"
      ]
    }
  }
];

// 15 KID'S SPORT PRODUCTS
const sportProducts = [
  {
    name: "Junior Speed-Flash Athletic Runner Neon Volt & Black",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.juniorRunner,
    hoverImage: KIDS_IMG.kidsSneakers,
    thirdImage: KIDS_IMG.playRunner,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2350,
    star: 5,
    Discount: 15,
    selling: 125,
    stock: 50,
    shortDescription: "High-performance junior running sneaker featuring breathable aeromesh, high-rebound phylon midsole, and high-visibility neon volt.",
    Description: {
      Item_code: "TS-KS-101",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Engineered Aeromesh & Seamless TPU",
      Sole_material: "High-Rebound Phylon EVA & Rubber Pods",
      Color: "Neon Volt & Jet Black",
      product: [
        "Breathable multi-pore engineered mesh keeps feet cool during sprints",
        "Phylon midsole absorbs shock from playground concrete",
        "Segmented rubber outsole pods provide multi-direction traction",
        "Quick bungee lacing with top velcro power strap"
      ]
    }
  },
  {
    name: "Light-Up Heel Shock-Absorbing Sneaker Cosmic Blue",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [26, 27, 28, 29, 30, 31, 32],
    mainImage: KIDS_IMG.kidsSneakers,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.playRunner,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2450,
    star: 5,
    Discount: 10,
    selling: 150,
    stock: 60,
    shortDescription: "Exciting impact-activated LED lights in the translucent heel pod flash with every step, paired with cushioned athletic support.",
    Description: {
      Item_code: "TS-KS-102",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Metallic Knit & Reflective Synthetics",
      Sole_material: "Impact-Activated LED Pod & Grip Rubber",
      Color: "Cosmic Blue & Silver",
      product: [
        "Bright impact-activated multi-color LEDs in heel flash as child runs",
        "Long-lasting sealed battery unit safe for rain and puddle splashes",
        "Dual-density shock cushioning prevents heel bone bruising",
        "Easy single-pull wide velcro power strap"
      ]
    }
  },
  {
    name: "Air-Cushion Junior Performance Trainer Coral Pink",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [27, 28, 29, 30, 31, 32, 33, 34],
    mainImage: KIDS_IMG.playRunner,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2500,
    star: 5,
    Discount: 12,
    selling: 98,
    stock: 44,
    shortDescription: "Visible 180-degree air pocket in the heel delivers responsive bounce for school sports, gymnastics, and weekend playground games.",
    Description: {
      Item_code: "TS-KS-103",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Breathable Jacquard Knit & TPU Welds",
      Sole_material: "180-Degree Pressurized Air Unit & Rubber",
      Color: "Coral Pink & Pure White",
      product: [
        "Visible pressurized helium air capsule provides soft landings",
        "TPU midfoot saddle locks foot securely inside shoe",
        "Waffle flex-grooves on forefoot allow natural toe push-off",
        "Antimicrobial moisture-wicking memory foam sockliner"
      ]
    }
  },
  {
    name: "Dual-Velcro All-Terrain Court Sneaker White & Royal",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [27, 28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.comfortSport,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.playRunner,
    price: 2150,
    star: 5,
    Discount: 15,
    selling: 112,
    stock: 48,
    shortDescription: "Durable tennis court shoe with non-marking gum sole, twin velcro straps, and scuff-resistant leather toe for gym classes.",
    Description: {
      Item_code: "TS-KS-104",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Synthetic Leather & Perforated Vamp",
      Sole_material: "Non-Marking Indoor Gym Rubber Sole",
      Color: "Chalk White & Royal Blue",
      product: [
        "Approved non-marking gum sole won't leave streaks on gym floors",
        "Twin oversized velcro straps provide lockdown support",
        "Perforated toe box vents moisture quickly",
        "Reinforced sidewall stitching for lateral cutting motions"
      ]
    }
  },
  {
    name: "Ultralight Breathable Knit Slip-On Runner Aqua Teal",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.juniorRunner,
    hoverImage: KIDS_IMG.playRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.comfortSport,
    price: 1950,
    star: 5,
    Discount: 10,
    selling: 135,
    stock: 58,
    shortDescription: "Sock-like seamless flyknit runner in refreshing aqua teal with elastic ribbed collar that weighs under 140 grams.",
    Description: {
      Item_code: "TS-KS-105",
      Brand: "Trends Shop Athletics",
      Upper_Material: "3D Seamless Engineered Flyknit",
      Sole_material: "Ultralight Injection Molded EVA Sole",
      Color: "Aqua Teal & White",
      product: [
        "Featherlight 140g construction won't weigh down young runners",
        "Seamless one-piece knit eliminates all blister points",
        "Slip-on collar with front and back finger pull tabs",
        "Flexible grooved outsole expands dynamically with foot strike"
      ]
    }
  },
  {
    name: "Junior High-Traction Turf Football Trainer Crimson",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.kidsSneakers,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.comfortSport,
    fourthImage: KIDS_IMG.playRunner,
    price: 2600,
    star: 5,
    Discount: 15,
    selling: 89,
    stock: 35,
    shortDescription: "Specialized artificial turf football shoe with micro rubber studs, textured ball-control vamp, and padded ankle cup.",
    Description: {
      Item_code: "TS-KS-106",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Micro-Textured Synthetic Leather",
      Sole_material: "Turf Multi-Stud Rubber Cleats",
      Color: "Crimson Red & Black",
      product: [
        "Low-profile multi-stud rubber sole grips synthetic grass safely",
        "Textured control ribs on instep improve soccer ball touch",
        "Asymmetric lacing creates cleaner striking surface on instep",
        "Padded heel cup locks foot during quick direction changes"
      ]
    }
  },
  {
    name: "Zero-Gravity School Gym Running Shoe Triple Black",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.comfortSport,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.playRunner,
    price: 2250,
    star: 5,
    Discount: 10,
    selling: 145,
    stock: 65,
    shortDescription: "All-black athletic running shoe compliant with sports uniform regulations, featuring high-rebound cloud foam and elastic speed-laces.",
    Description: {
      Item_code: "TS-KS-107",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Antimicrobial Ballistic Mesh & TPU",
      Sole_material: "Zero-Gravity Cloud Foam & Rubber Base",
      Color: "All Pitch Black",
      product: [
        "100% Monochrome black design meets strict school sports uniform rules",
        "Individual cloud pods compress on impact to protect growing knees",
        "Elastic bungee speed-laces with hook-and-loop security tab",
        "Reinforced rubber toe cap stops wear from toe-draggers"
      ]
    }
  },
  {
    name: "Junior High-Top Basketball Court Sneaker White & Red",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.kidsSneakers,
    hoverImage: KIDS_IMG.comfortSport,
    thirdImage: KIDS_IMG.juniorRunner,
    fourthImage: KIDS_IMG.playRunner,
    price: 2750,
    star: 5,
    Discount: 20,
    selling: 76,
    stock: 32,
    shortDescription: "High-top basketball shoe with thick padded ankle brace collar, herringbone traction outsole, and shock-damping heel unit.",
    Description: {
      Item_code: "TS-KS-108",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Tumbled Leather & Perforated Panels",
      Sole_material: "Herringbone Pivot Rubber Outsole",
      Color: "Varsity Red & White",
      product: [
        "Padded high-cut collar provides essential lateral ankle stability",
        "Herringbone tread pattern with pivot circle for rapid cuts",
        "Thick EVA wedge midsole dampens high jumping landings",
        "Durable stitched cupsole construction"
      ]
    }
  },
  {
    name: "Flexible Flex-Groove Track Shoe Lemon Yellow",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [26, 27, 28, 29, 30, 31, 32, 33],
    mainImage: KIDS_IMG.juniorRunner,
    hoverImage: KIDS_IMG.playRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2100,
    star: 5,
    Discount: 10,
    selling: 84,
    stock: 40,
    shortDescription: "Vibrant lemon yellow athletic trainer with deep laser-cut hexagonal flex grooves allowing full foot flexion during PE classes.",
    Description: {
      Item_code: "TS-KS-109",
      Brand: "Trends Shop Athletics",
      Upper_Material: "High-Stretch Breathable Monomesh",
      Sole_material: "Deep Hexagonal Flex-Groove EVA Outsole",
      Color: "Lemon Yellow & Charcoal",
      product: [
        "Hexagonal cuts across sole allow foot to flex in all natural angles",
        "Ultra-lightweight upper allows maximum athletic agility",
        "Padded achilles tendon notch prevents rubbing",
        "Reflective trim along side logo for evening safety"
      ]
    }
  },
  {
    name: "Junior Trail-Grip Mud & Hill Runner Forest Green",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.kidsHiker,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2550,
    star: 5,
    Discount: 15,
    selling: 68,
    stock: 30,
    shortDescription: "Rugged trail running shoe featuring multi-directional dirt lugs, water-repellent ripstop upper, and synthetic rock protection toe bumper.",
    Description: {
      Item_code: "TS-KS-110",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Water-Shield Ripstop & Synthetic Leather",
      Sole_material: "Deep Chevron Lug All-Terrain Rubber",
      Color: "Forest Green & Blaze Orange",
      product: [
        "4mm chevron lugs dig into loose gravel, grass & hill paths",
        "Hardened toe bumper protects against roots and hidden rocks",
        "Gusseted tongue keeps trail dirt and sand out of shoe",
        "Water-repellent finish repels morning dew and shallow puddles"
      ]
    }
  },
  {
    name: "Aerobic Dance & Gymnastics Trainer Rose Gold",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [26, 27, 28, 29, 30, 31, 32],
    mainImage: KIDS_IMG.playRunner,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2300,
    star: 5,
    Discount: 10,
    selling: 91,
    stock: 42,
    shortDescription: "Flexible studio sneaker designed for gymnastics, cheer, and dance with spin-pivot sole and metallic rose gold heel trim.",
    Description: {
      Item_code: "TS-KS-111",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Metallic Foil Trim & Micro-Knit Mesh",
      Sole_material: "Smooth Studio Gum Rubber with Spin Pad",
      Color: "Rose Gold & Pearl White",
      product: [
        "Smooth ball-of-foot spin spot facilitates 360-degree dance pirouettes",
        "Non-marking rubber ensures studio and gym compliance",
        "Super-soft microfiber lining for barefoot or thin sock wear",
        "Elastic cross-straps keep shoe snug during acrobatics"
      ]
    }
  },
  {
    name: "Night-Glow Reflective Sprint Runner Silver & Orange",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.comfortSport,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.playRunner,
    price: 2400,
    star: 5,
    Discount: 12,
    selling: 82,
    stock: 36,
    shortDescription: "Full-coverage 3M reflective runner that illuminates brilliantly under vehicle headlights, with shock-absorbing dual-density sole.",
    Description: {
      Item_code: "TS-KS-112",
      Brand: "Trends Shop Athletics",
      Upper_Material: "3M Scotchlite Retro-Reflective Mesh",
      Sole_material: "Dual-Density Shock Absorbing EVA & Rubber",
      Color: "Reflective Silver & Vibrant Orange",
      product: [
        "360-degree reflective upper shines bright white under headlights",
        "Crucial safety footwear for predawn school commutes & evening play",
        "Padded tongue and ankle collar protect sensitive ankle bones",
        "Bouncy EVA sole cushions high-speed sprints"
      ]
    }
  },
  {
    name: "Junior Chunky Wave Sole Dad Sneaker Multi-Pastel",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [27, 28, 29, 30, 31, 32, 33, 34],
    mainImage: KIDS_IMG.playRunner,
    hoverImage: KIDS_IMG.kidsSneakers,
    thirdImage: KIDS_IMG.juniorRunner,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2350,
    star: 5,
    Discount: 18,
    selling: 118,
    stock: 46,
    shortDescription: "Trendy wave-sculpted platform sneaker in sweet pastel color blocks with featherlight cushioned sole for weekend fashion.",
    Description: {
      Item_code: "TS-KS-113",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Multi-Panel Suede, PU & Breathable Mesh",
      Sole_material: "Wave-Molded Lightweight Bubble EVA Sole",
      Color: "Pastel Mint, Lilac & Buttercup Yellow",
      product: [
        "Sculpted wave bubble sole delivers ultra-cushioned step feel",
        "Playful pastel block panels match summer outfits",
        "Wide footprint prevents wobbles and ankle twists",
        "Removable memory foam cushion insole"
      ]
    }
  },
  {
    name: "Cross-Training Gym Shoe with Ankle Strap Stealth Grey",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.comfortSport,
    hoverImage: KIDS_IMG.juniorRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.playRunner,
    price: 2250,
    star: 5,
    Discount: 10,
    selling: 77,
    stock: 38,
    shortDescription: "Versatile indoor gym training shoe with top power strap, reinforced heel stabilizer, and high-abrasion non-scuff rubber sole.",
    Description: {
      Item_code: "TS-KS-114",
      Brand: "Trends Shop Athletics",
      Upper_Material: "High-Tenacity Breathable Mesh & Suede",
      Sole_material: "High-Abrasion Anti-Slip Rubber Sole",
      Color: "Stealth Grey & Electric Cyan",
      product: [
        "Wide ankle power strap locks foot firmly in place for jumps",
        "Medial arch support promotes proper running posture",
        "High-abrasion rubber base lasts through tough school sports seasons",
        "Breathable mesh keeps feet cool and sweat-free"
      ]
    }
  },
  {
    name: "Junior Marathon PEBA Foam Racer Solar Cyan",
    category: "KID'S SPORT",
    gender: "KID'S",
    seller: "Trends Shop Athletics",
    size: [28, 29, 30, 31, 32, 33, 34, 35],
    mainImage: KIDS_IMG.juniorRunner,
    hoverImage: KIDS_IMG.playRunner,
    thirdImage: KIDS_IMG.kidsSneakers,
    fourthImage: KIDS_IMG.comfortSport,
    price: 2700,
    star: 5,
    Discount: 15,
    selling: 64,
    stock: 28,
    shortDescription: "Elite junior race-day running shoe with hyper-rebound PEBA superfoam, curved TPU propulsion plate, and translucent monomesh.",
    Description: {
      Item_code: "TS-KS-115",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Translucent Monomesh & TPU Overlays",
      Sole_material: "Hyper-Reactive PEBA Superfoam & TPU Plate",
      Color: "Solar Cyan & Flame Orange",
      product: [
        "PEBA superfoam provides 80% bouncy energy return on every stride",
        "Curved TPU propulsion plate guides smooth heel-to-toe transition",
        "Featherlight 150g race-day weight for competitive sports days",
        "Micro-perforated racer tongue dissipates heat rapidly"
      ]
    }
  }
];

// Combine all 45 products and set cateimg to mainImage
const all45KidsProducts = [
  ...formalProducts.map(p => ({ ...p, cateimg: p.mainImage })),
  ...casualProducts.map(p => ({ ...p, cateimg: p.mainImage })),
  ...sportProducts.map(p => ({ ...p, cateimg: p.mainImage }))
];

async function seed45KidsShoes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('TrendsShop');
    const shoesCol = db.collection('shoes');

    console.log(`Inserting ${all45KidsProducts.length} new genuine kids footwear products...`);
    const result = await shoesCol.insertMany(all45KidsProducts);
    console.log(`Successfully added ${result.insertedCount} kids products!`);

    const totalCount = await shoesCol.countDocuments();
    console.log(`Total footwear products now in database: ${totalCount}`);

    // Print breakdown
    const formalCount = await shoesCol.countDocuments({ category: "KID'S FORMAL" });
    const casualCount = await shoesCol.countDocuments({ category: "KID'S CASUAL" });
    const sportCount = await shoesCol.countDocuments({ category: "KID'S SPORT" });
    console.log(`Kid's Counts -> KID'S FORMAL: ${formalCount}, KID'S CASUAL: ${casualCount}, KID'S SPORT: ${sportCount}`);
  } finally {
    await client.close();
  }
}

seed45KidsShoes().catch(console.error);
