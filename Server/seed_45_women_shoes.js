const { MongoClient } = require('mongodb');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
require('dotenv').config();

const uri = process.env.MONGODB_URI || (process.env.DB_USER && process.env.DB_PASS ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` : '');

// 15 WOMEN'S FORMAL PRODUCTS
const formalProducts = [
  {
    name: "Velvet Stiletto Pointed Pump Emerald Night",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    price: 4250,
    star: 5,
    Discount: 15,
    selling: 54,
    stock: 28,
    shortDescription: "Ultra-sleek pointed-toe stiletto pump tailored in rich emerald velvet with a 3.75-inch lacquered heel and latex-cushioned insole.",
    Description: {
      Item_code: "TS-WF-101",
      Brand: "Trends Shop Haute",
      Upper_Material: "Premium Italian Silk Velvet",
      Sole_material: "Non-Slip Polished Leather Outsole",
      Color: "Emerald Night Green",
      product: [
        "Lustrous jewel-tone silk velvet exterior",
        "Pointed silhouette with 95mm contoured stiletto heel",
        "Triple-layer anti-fatigue memory footbed",
        "Protective rubber strike pad on heel tip"
      ]
    }
  },
  {
    name: "D'Orsay Pointed-Toe Pump Ivory Pearl",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 4650,
    star: 5,
    Discount: 10,
    selling: 62,
    stock: 30,
    shortDescription: "Signature side-cutout D'Orsay silhouette sculpted in pearlescent nappa leather, ideal for weddings, galas, and upscale occasions.",
    Description: {
      Item_code: "TS-WF-102",
      Brand: "Trends Shop Haute",
      Upper_Material: "Pearlescent Lambskin Nappa",
      Sole_material: "Vegetable-Tanned Italian Leather Outsole",
      Color: "Ivory Pearl White",
      product: [
        "Architectural D'Orsay inner-arch cutout",
        "Delicate 85mm tapered French kitten heel",
        "Breathable seamless kidskin lining",
        "Handcrafted in Florence, Italy"
      ]
    }
  },
  {
    name: "Ankle-Strap Block Heel Sandal Nude Blush",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop",
    price: 3850,
    star: 5,
    Discount: 12,
    selling: 78,
    stock: 45,
    shortDescription: "Refined minimalist single-strap dress sandal set on a stable 3-inch architectural block heel with adjustable gold-tone buckle.",
    Description: {
      Item_code: "TS-WF-103",
      Brand: "Trends Shop Haute",
      Upper_Material: "Smooth Full-Grain Calf Leather",
      Sole_material: "Durable Leather Composite Outsole",
      Color: "Blush Nude",
      product: [
        "Minimalist slender toe strap with soft rolled edges",
        "75mm sturdy block heel for all-day cocktail poise",
        "Reinforced ankle strap with 24k gold-plated buckle",
        "Micro-gel cushion ball-of-foot support"
      ]
    }
  },
  {
    name: "Patent Leather Court Pump Royal Burgundy",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    price: 4400,
    star: 5,
    Discount: 20,
    selling: 49,
    stock: 24,
    shortDescription: "High-shine patent leather court shoe with deep oxblood wine gloss, commanding presence for boardroom meetings and formal banquets.",
    Description: {
      Item_code: "TS-WF-104",
      Brand: "Trends Shop Atelier",
      Upper_Material: "High-Gloss Spazzolato Patent Leather",
      Sole_material: "Channel-Stitched Leather Sole",
      Color: "Royal Burgundy",
      product: [
        "Mirror-finish high-gloss Italian patent leather",
        "85mm slim column heel with shock-absorbing cap",
        "Hand-stitched leather welting",
        "Moisture-wicking goat leather sockliner"
      ]
    }
  },
  {
    name: "Slingback Pointed Kitten Heel Champagne Gold",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    price: 3950,
    star: 5,
    Discount: 10,
    selling: 71,
    stock: 32,
    shortDescription: "Delicate pointed slingback resting on a comfortable 55mm kitten heel, adorned with fine champagne metallic micro-sheen.",
    Description: {
      Item_code: "TS-WF-105",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Metallic Foil Finished Lambskin",
      Sole_material: "Fine Leather Outsole with Non-Slip Grip",
      Color: "Champagne Gold",
      product: [
        "55mm kitten heel combines grace and walking endurance",
        "Elasticated slingback strap for customized stay-put fit",
        "Subtle champagne metallic luster",
        "Anatomically contoured arch support"
      ]
    }
  },
  {
    name: "Double-Strap Mary Jane Pump Midnight Black",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    price: 4100,
    star: 5,
    Discount: 15,
    selling: 58,
    stock: 36,
    shortDescription: "Vintage-inspired twin instep strap Mary Jane pump crafted in rich midnight black polished boxcalf with a sculpted 70mm heel.",
    Description: {
      Item_code: "TS-WF-106",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Full-Grain Polished Boxcalf Leather",
      Sole_material: "Hand-Waxed Leather Sole",
      Color: "Midnight Black",
      product: [
        "Dual slender instep straps with polished silver buckles",
        "Vintage almond toe silhouette with reinforced toe box",
        "70mm curved block heel",
        "Full lambskin lining with memory-foam pillowing"
      ]
    }
  },
  {
    name: "Crystal-Embellished Satin Stiletto Silver Glow",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    price: 5200,
    star: 5,
    Discount: 10,
    selling: 83,
    stock: 20,
    shortDescription: "Showstopping evening pump with Swarovski crystal brooches set over lustrous silk duchess satin, complete with a 100mm pin stiletto.",
    Description: {
      Item_code: "TS-WF-107",
      Brand: "Trends Shop Haute",
      Upper_Material: "Duchess Silk Satin & Hand-Set Crystals",
      Sole_material: "Polished Italian Leather Sole",
      Color: "Silver Glow",
      product: [
        "Hand-set Austrian crystal sunburst ornament on toe",
        "100mm razor-thin steel-reinforced stiletto heel",
        "Supple silk satin with spill-resistant coating",
        "Cushioned leather bed designed for red carpet events"
      ]
    }
  },
  {
    name: "Sculptural Heel Pointed Mule Onyx Black",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop",
    price: 4300,
    star: 5,
    Discount: 18,
    selling: 65,
    stock: 25,
    shortDescription: "Avant-garde slip-on evening mule with sharp pointed vamp and an architectural geometric brass-tipped block heel.",
    Description: {
      Item_code: "TS-WF-108",
      Brand: "Trends Shop Haute",
      Upper_Material: "Fine Italian Glazed Goatskin",
      Sole_material: "Brushed Leather with Grip Rubber Forefoot",
      Color: "Onyx Black",
      product: [
        "Sharp modern pointed vamp contour",
        "65mm architectural geometric heel with metallic cap",
        "Backless slide-on design with padded heel notch",
        "Ultra-smooth kidskin footbed"
      ]
    }
  },
  {
    name: "T-Strap Flared Heel Pump Crimson Red",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    price: 4500,
    star: 5,
    Discount: 15,
    selling: 50,
    stock: 22,
    shortDescription: "Dramatic 1920s Art-Deco T-strap silhouette rendered in fiery crimson patent leather with an 80mm flared trumpet heel.",
    Description: {
      Item_code: "TS-WF-109",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Mirror Patent Calf Leather",
      Sole_material: "Handcrafted Vegetable-Tanned Outsole",
      Color: "Crimson Red",
      product: [
        "Art-Deco central T-strap elongates foot profile",
        "80mm flared trumpet heel provides remarkable balance",
        "Secure buckled ankle closure",
        "Double-padded latex insole"
      ]
    }
  },
  {
    name: "Croc-Embossed Leather Pump Espresso Brown",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop",
    price: 4150,
    star: 5,
    Discount: 10,
    selling: 72,
    stock: 34,
    shortDescription: "Exotic textured crocodile-embossed calfskin pump in deep roasted espresso with a confident 75mm mid stiletto.",
    Description: {
      Item_code: "TS-WF-110",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Crocodile-Embossed Italian Calf Leather",
      Sole_material: "Buffed Leather Sole with Rubber Inset",
      Color: "Espresso Brown",
      product: [
        "Deep heat-stamped crocodile scales with two-tone finish",
        "75mm mid stiletto for corporate versatility",
        "Soft suede heel counter prevents heel slippage",
        "Reinforced arch bridge"
      ]
    }
  },
  {
    name: "Peep-Toe D'Orsay Stiletto Rose Dust",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    price: 4350,
    star: 5,
    Discount: 15,
    selling: 46,
    stock: 26,
    shortDescription: "Flirty front peep-toe and open side cutouts in dusty rose nappa, finished with a 90mm gold-stem stiletto.",
    Description: {
      Item_code: "TS-WF-111",
      Brand: "Trends Shop Haute",
      Upper_Material: "Supple Nappa Leather",
      Sole_material: "Full Italian Leather Sole",
      Color: "Rose Dust Pink",
      product: [
        "Refined crescent peep-toe aperture",
        "90mm metallic gold-plated stiletto pillar",
        "Side cutout ventilation keeps feet cool",
        "Memory foam cushioned ball padding"
      ]
    }
  },
  {
    name: "Suede Pointed-Toe Court Pump Cobalt Navy",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop",
    price: 4100,
    star: 5,
    Discount: 20,
    selling: 53,
    stock: 31,
    shortDescription: "Sumptuous velvety kid suede pump in electric cobalt navy with classic 85mm stiletto and tapered pointed toe.",
    Description: {
      Item_code: "TS-WF-112",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Velvety Spanish Kid Suede",
      Sole_material: "Tanned Leather Outsole",
      Color: "Cobalt Navy Blue",
      product: [
        "Rich deep nap kid suede with water-resistant finish",
        "85mm self-covered suede stiletto heel",
        "Seamless glove-like fit around instep",
        "Orthopedic arch cushion"
      ]
    }
  },
  {
    name: "Strappy Metallic Evening Stiletto Platinum",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    price: 4900,
    star: 5,
    Discount: 10,
    selling: 68,
    stock: 22,
    shortDescription: "Gleaming platinum metallic multi-cross strappy sandal with an ethereal 100mm heel, built for red carpets and high-society receptions.",
    Description: {
      Item_code: "TS-WF-113",
      Brand: "Trends Shop Haute",
      Upper_Material: "Liquid Mirror Metallic Leather",
      Sole_material: "Lacquered Genuine Leather Outsole",
      Color: "Platinum Silver",
      product: [
        "Crisscross micro-straps frame the foot beautifully",
        "100mm pin stiletto heel with titanium core",
        "Buckled wrap ankle fastener with micro adjustments",
        "Lightweight construction with padded footbed"
      ]
    }
  },
  {
    name: "Glossy Patent Slingback Heel Pastel Lilac",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    price: 3750,
    star: 5,
    Discount: 15,
    selling: 60,
    stock: 35,
    shortDescription: "Charming pastel lilac patent slingback with contrasting tortoiseshell buckle and low 60mm sculpted flared heel.",
    Description: {
      Item_code: "TS-WF-114",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Glossy Calfskin Patent",
      Sole_material: "Non-Skid Leather Injected Sole",
      Color: "Pastel Lilac",
      product: [
        "Tonal pastel gloss creates sweet springtime formality",
        "60mm comfortable architectural flared heel",
        "Padded slingback backstrap never pinches",
        "Breathable leather inner lining"
      ]
    }
  },
  {
    name: "Heritage Cap-Toe Pump Caramel Tan",
    category: "WOMEN'S FORMAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Atelier",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    price: 4300,
    star: 5,
    Discount: 10,
    selling: 57,
    stock: 29,
    shortDescription: "Iconic two-tone French cap-toe court pump in rich caramel tan calfskin with contrasting black patent toe box and 70mm heel.",
    Description: {
      Item_code: "TS-WF-115",
      Brand: "Trends Shop Atelier",
      Upper_Material: "Smooth French Calfskin & Patent Toe",
      Sole_material: "Goodyear-Stitched Leather Outsole",
      Color: "Caramel Tan & Black",
      product: [
        "Timeless Parisian two-tone cap-toe styling",
        "70mm mid block heel for poised boardroom authority",
        "Goodyear welted durability and stability",
        "Full glove-leather lining with high arch pillow"
      ]
    }
  }
];

// 15 WOMEN'S CASUAL PRODUCTS
const casualProducts = [
  {
    name: "Artisan Leather Penny Loafer Chestnut Brown",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    price: 3650,
    star: 5,
    Discount: 15,
    selling: 84,
    stock: 42,
    shortDescription: "Hand-stitched moc-toe penny loafer in supple pull-up chestnut leather with flexible stacked heel and leather cushion footbed.",
    Description: {
      Item_code: "TS-WC-101",
      Brand: "Trends Shop Daily",
      Upper_Material: "Full-Grain Pull-Up Cowhide",
      Sole_material: "Flexible Crepe & Leather Hybrid Sole",
      Color: "Chestnut Brown",
      product: [
        "Hand-stitched beefroll moc toe detailing",
        "Traditional penny slot saddle strap",
        "Ultra-soft interior molds to your foot shape",
        "Reinforced heel counter with rubber traction pod"
      ]
    }
  },
  {
    name: "Backless Leather Mule Sand Beige",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 3250,
    star: 5,
    Discount: 10,
    selling: 92,
    stock: 50,
    shortDescription: "Effortless slip-on almond-toe mule cut from buttery-soft sand beige nappa with a low 20mm stacked wood heel.",
    Description: {
      Item_code: "TS-WC-102",
      Brand: "Trends Shop Daily",
      Upper_Material: "Buttery Nappa Calf Leather",
      Sole_material: "Textured Anti-Slip Rubber Outsole",
      Color: "Sand Beige",
      product: [
        "Effortless slip-on silhouette for chic daily errands",
        "20mm stacked wood heel with rubber tread",
        "Padded arch and metatarsal cushion",
        "Breathable leather upper keeps feet fresh"
      ]
    }
  },
  {
    name: "Chelsea Ankle Bootie Burnished Tan",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    price: 4350,
    star: 5,
    Discount: 18,
    selling: 76,
    stock: 35,
    shortDescription: "Iconic British Chelsea ankle boot featuring dual tonal elastic side gores, pull loops, and a weather-sealed lug tread.",
    Description: {
      Item_code: "TS-WC-103",
      Brand: "Trends Shop Heritage",
      Upper_Material: "Oiled Full-Grain Waxed Leather",
      Sole_material: "All-Terrain Commando Rubber Lug Sole",
      Color: "Burnished Tan",
      product: [
        "High-density elastic goring for easy on and off",
        "Durable Goodyear storm-welt construction",
        "Weatherproof treated exterior resists rain and stains",
        "35mm low block heel gives grounded confidence"
      ]
    }
  },
  {
    name: "Quilted Leather Ballerina Flat Classic Black",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    price: 2950,
    star: 5,
    Discount: 10,
    selling: 110,
    stock: 60,
    shortDescription: "Parisian-inspired diamond-quilted lambskin ballet flat with patent round toe and delicate grosgrain bow tie.",
    Description: {
      Item_code: "TS-WC-104",
      Brand: "Trends Shop Daily",
      Upper_Material: "Diamond-Quilted Lambskin Leather",
      Sole_material: "Ultra-Flexible Split-Sole Rubber",
      Color: "Classic Black",
      product: [
        "Plush diamond quilting with glossy patent toe cap",
        "Foldable ultra-flexible construction for handbag travel",
        "Full lambskin lining with arch pillow",
        "Dainty grosgrain bow with gold metal aglets"
      ]
    }
  },
  {
    name: "Woven Leather Slip-On Espadrille Cream",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    price: 3100,
    star: 5,
    Discount: 12,
    selling: 64,
    stock: 38,
    shortDescription: "Hand-braided intrecio leather upper set on a natural Spanish jute rope sole with vulcanized rubber bottom for sunny strolls.",
    Description: {
      Item_code: "TS-WC-105",
      Brand: "Trends Shop Daily",
      Upper_Material: "Hand-Woven Calfskin Strips",
      Sole_material: "Natural Jute Braid & Vulcanized Rubber",
      Color: "Cream White",
      product: [
        "Breathable open-weave leather allows air circulation",
        "Authentic Mediterranean braided jute sole",
        "Durable vulcanized water-resistant rubber bottom",
        "Elastic side gusset for flex when walking"
      ]
    }
  },
  {
    name: "Chunky Lug-Sole Bit Loafer Glossy Black",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 3950,
    star: 5,
    Discount: 20,
    selling: 95,
    stock: 40,
    shortDescription: "Bold statement chunky loafer adorned with antiqued gold horsebit hardware atop a 45mm lightweight EVA cleated platform.",
    Description: {
      Item_code: "TS-WC-106",
      Brand: "Trends Shop Heritage",
      Upper_Material: "Semi-Gloss Polished Cowhide",
      Sole_material: "Extralight Cleated EVA Lug Outsole",
      Color: "Glossy Black",
      product: [
        "Antiqued gold-toned brass horsebit accent",
        "45mm chunky platform provides lift without weight",
        "Deep tooth cleated lug pattern for maximum traction",
        "Padded collar and anti-blister heel pocket"
      ]
    }
  },
  {
    name: "Suede Moccasin Driving Shoe Forest Olive",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    price: 3450,
    star: 5,
    Discount: 15,
    selling: 62,
    stock: 33,
    shortDescription: "Classic Italian gommino driving moccasin in plush moss olive suede with rubber pebble studs wrapping the heel.",
    Description: {
      Item_code: "TS-WC-107",
      Brand: "Trends Shop Daily",
      Upper_Material: "Velveteen Water-Repellent Calf Suede",
      Sole_material: "133 Rubber Pebble Driving Studs",
      Color: "Forest Olive Green",
      product: [
        "Individual rubber studs extend up heel for driving grip",
        "Hand-tied tonal leather bow with brass aglets",
        "Tubular moccasin construction hugs the foot",
        "Unlined forefoot for glove-like barefoot comfort"
      ]
    }
  },
  {
    name: "Pointed-Toe Leather Mule Terracotta",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    price: 3350,
    star: 5,
    Discount: 10,
    selling: 58,
    stock: 28,
    shortDescription: "Sleek pointed slip-on flat mule crafted from warm terracotta burnished leather, effortlessly elevating denim and linen ensembles.",
    Description: {
      Item_code: "TS-WC-108",
      Brand: "Trends Shop Daily",
      Upper_Material: "Vegetable-Tanned Cowhide",
      Sole_material: "Non-Marking Resin Rubber Sole",
      Color: "Terracotta Rust",
      product: [
        "Elongated pointed toe creates flattering silhouette",
        "Deep V-cut vamp for smooth instep fit",
        "15mm low heel with shock-absorbing rubber cap",
        "Padded leather insole ensures all-day ease"
      ]
    }
  },
  {
    name: "Buckled Western Ankle Boot Vintage Cognac",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    price: 4500,
    star: 5,
    Discount: 15,
    selling: 70,
    stock: 31,
    shortDescription: "Americana-inspired western ankle boot with antique brass harness ring, tapered Cuban heel, and hand-distressed cognac leather.",
    Description: {
      Item_code: "TS-WC-109",
      Brand: "Trends Shop Heritage",
      Upper_Material: "Vintage-Distressed Full-Grain Leather",
      Sole_material: "Stitched Neolite Leather Composite Outsole",
      Color: "Vintage Cognac",
      product: [
        "Antique brass harness ring and buckle strap system",
        "40mm slanted Cuban block heel for western swagger",
        "Interior brass side zip for effortless wear",
        "Cushioned footbed lined with antibacterial microfibre"
      ]
    }
  },
  {
    name: "Minimalist Round-Toe Ballet Flat Rose Nude",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    price: 2850,
    star: 5,
    Discount: 10,
    selling: 115,
    stock: 65,
    shortDescription: "Featherlight everyday ballet flat with clean stitchless topline in blushing rose nude, built with pillow-soft memory foam.",
    Description: {
      Item_code: "TS-WC-110",
      Brand: "Trends Shop Daily",
      Upper_Material: "Silky Soft Glove Nappa",
      Sole_material: "Flexible Slip-Resistant Rubber",
      Color: "Rose Nude",
      product: [
        "Seamless glove leather construction prevents hot spots",
        "Elasticated topline hugs foot like a second skin",
        "Dual-density orthotic memory foam cushion",
        "Weighs only 140g per shoe"
      ]
    }
  },
  {
    name: "Crisscross Leather Slide Sandal Warm Honey",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 2650,
    star: 5,
    Discount: 15,
    selling: 88,
    stock: 52,
    shortDescription: "Wide crisscross strap slide sandal in rich honey leather with anatomically molded cork-latex footbed and EVA sole.",
    Description: {
      Item_code: "TS-WC-111",
      Brand: "Trends Shop Daily",
      Upper_Material: "Oiled Full-Grain Pull-Up Leather",
      Sole_material: "Molded Cork & Light EVA Outsole",
      Color: "Warm Honey Brown",
      product: [
        "Wide cross straps hold the foot comfortably in place",
        "Anatomical deep heel cup and arch support",
        "Natural cork footbed absorbs impact",
        "Suede-lined topbed prevents slipping"
      ]
    }
  },
  {
    name: "Suede Desert Chukka Boot Charcoal Grey",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    price: 3850,
    star: 5,
    Discount: 10,
    selling: 52,
    stock: 29,
    shortDescription: "Two-eyelet desert chukka ankle boot in velvety charcoal suede mounted on a supple natural crepe gum sole.",
    Description: {
      Item_code: "TS-WC-112",
      Brand: "Trends Shop Heritage",
      Upper_Material: "Heavyweight Charcoal Calf Suede",
      Sole_material: "Natural Plantation Crepe Gum Rubber",
      Color: "Charcoal Grey",
      product: [
        "Signature two-eyelet minimalist desert profile",
        "Springy plantation crepe sole cushions every step",
        "Scotchgard treated suede resists road moisture",
        "Breathable veg-tanned leather footbed"
      ]
    }
  },
  {
    name: "Platform Fisherman Sandal Jet Black",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 3600,
    star: 5,
    Discount: 20,
    selling: 74,
    stock: 37,
    shortDescription: "Contemporary caged fisherman sandal in smooth black boxcalf leather atop a lightweight 35mm platform sole with ankle buckle.",
    Description: {
      Item_code: "TS-WC-113",
      Brand: "Trends Shop Daily",
      Upper_Material: "Polished Boxcalf Leather",
      Sole_material: "Lightweight Cushion EVA Flatform",
      Color: "Jet Black",
      product: [
        "Structured caged vamp protects toes while offering airflow",
        "Adjustable ankle strap with silver pin buckle",
        "35mm flatform elevates without tipping or strain",
        "Water-resistant sealed leather edging"
      ]
    }
  },
  {
    name: "Tasseled Leather Driving Loafer French Navy",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    price: 3550,
    star: 5,
    Discount: 15,
    selling: 63,
    stock: 34,
    shortDescription: "Nautical-inspired driving loafer in deep navy leather with hand-cut twin tassels and segmented driving grip pods.",
    Description: {
      Item_code: "TS-WC-114",
      Brand: "Trends Shop Daily",
      Upper_Material: "Drum-Dyed French Calfskin",
      Sole_material: "Segmented Rubber Grip Pods",
      Color: "French Navy Blue",
      product: [
        "Hand-rolled twin leather tassels on instep",
        "Contoured driving pads offer pedal control and flexibility",
        "Contrast white perimeter stitchwork",
        "Leather-lined orthotic arch bridge"
      ]
    }
  },
  {
    name: "Cozy Shearling-Lined Suede Mules Camel Tan",
    category: "WOMEN'S CASUAL",
    gender: "WOMEN'S",
    seller: "Trends Shop Everyday",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop",
    price: 3750,
    star: 5,
    Discount: 10,
    selling: 81,
    stock: 39,
    shortDescription: "Ultra-plush slip-on Boston style mule in camel tan suede, fully lined with real Australian shearling wool for cloudlike warmth.",
    Description: {
      Item_code: "TS-WC-115",
      Brand: "Trends Shop Heritage",
      Upper_Material: "Heavyweight Camel Calf Suede",
      Sole_material: "Molded Cork Midsole & EVA Outsole",
      Color: "Camel Tan",
      product: [
        "100% Genuine Australian shearling lining",
        "Adjustable instep strap with matte brass pin buckle",
        "Molded orthopedic cork-latex footbed",
        "Lightweight EVA sole suitable for both indoor & outdoor"
      ]
    }
  }
];

// 15 WOMEN'S SPORT PRODUCTS
const sportProducts = [
  {
    name: "Retro Court Platform Sneaker Chalk White & Rose",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    price: 3850,
    star: 5,
    Discount: 15,
    selling: 96,
    stock: 45,
    shortDescription: "Vintage tennis-inspired sneaker crafted in chalk white premium nappa with dusty rose heel tab and 35mm cupsole.",
    Description: {
      Item_code: "TS-WS-101",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Full-Grain Nappa Leather & Suede Mudguard",
      Sole_material: "Non-Marking Natural Rubber Cupsole",
      Color: "Chalk White & Rose Pink",
      product: [
        "Crisp full-grain leather with perforated breathability holes",
        "Rose suede heel mustache tab with gold foil logo",
        "35mm flatform cupsole with honeycomb traction",
        "Removable ortholite antimicrobic cushioned insole"
      ]
    }
  },
  {
    name: "Chunky Dad Runner Sneaker Cloud Grey & Mint",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    price: 4200,
    star: 5,
    Discount: 20,
    selling: 104,
    stock: 48,
    shortDescription: "Y2K-inspired maximalist dad runner with multi-layered mesh panels, soft mint accents, and high-rebound sculpted midsole.",
    Description: {
      Item_code: "TS-WS-102",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Air Mesh, TPU Welds & Split Suede",
      Sole_material: "Dual-Density Phylon EVA & Rubber Outsole",
      Color: "Cloud Grey & Mint Green",
      product: [
        "Multi-layered textural panels engineered for maximum airflow",
        "Chunky sculpted phylon midsole provides pillow impact dampening",
        "TPU torsional bridge prevents midfoot twisting",
        "Reflective silver 3M piping on toe and heel"
      ]
    }
  },
  {
    name: "Ultralight Knit Slip-On Runner Lavender Fog",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    price: 3100,
    star: 5,
    Discount: 10,
    selling: 88,
    stock: 40,
    shortDescription: "Seamless one-piece stretch-knit sock sneaker in soothing lavender fog, weighing under 180 grams with memory-foam step.",
    Description: {
      Item_code: "TS-WS-103",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Breathable 3D Engineered Stretch Flyknit",
      Sole_material: "Supercritical Nitrogen Infused EVA Sole",
      Color: "Lavender Fog Purple",
      product: [
        "Single-piece seamless knit hugs like a supportive sock",
        "Slip-on ribbed collar with dual finger pull loops",
        "Nitrogen-infused foam bounce delivers 65% energy return",
        "Machine washable on cold gentle cycle"
      ]
    }
  },
  {
    name: "Air-Cushion Performance Athletic Trainer Neon Coral",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    price: 4450,
    star: 5,
    Discount: 15,
    selling: 79,
    stock: 35,
    shortDescription: "High-intensity running and workout shoe with visible 270-degree pressurized air heel pocket and energetic neon coral accents.",
    Description: {
      Item_code: "TS-WS-104",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Jacquard Technical Engineered Mesh",
      Sole_material: "270-Degree Pressurized Air Unit & Rubber",
      Color: "Neon Coral & Pure White",
      product: [
        "Visible pressurized helium air capsule in heel for zero-shock landing",
        "Dynamic ghillie flywire lacing system locks down midfoot",
        "High-abrasion rubber outsole with flex grooves",
        "Ergonomic molded heel counter locks Achilles safely"
      ]
    }
  },
  {
    name: "High-Top Leather Street Sneaker Off-White & Black",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    price: 4350,
    star: 5,
    Discount: 12,
    selling: 67,
    stock: 30,
    shortDescription: "Urban high-top basketball-heritage sneaker crafted from buttery tumbled off-white leather with contrasting black swoops.",
    Description: {
      Item_code: "TS-WS-105",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Tumbled Full-Grain Cow Leather",
      Sole_material: "Stitched Perimeter Rubber Cupsole",
      Color: "Off-White & Pitch Black",
      product: [
        "Padded high-cut ankle collar provides lateral support",
        "Stitched 360-degree sidewall ensures lifelong bonding",
        "Perforated toe vamp prevents moisture accumulation",
        "Thick cotton laces with metal branded tips"
      ]
    }
  },
  {
    name: "Minimalist Leather Court Low-Top Pastel Pink",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    price: 3600,
    star: 5,
    Discount: 10,
    selling: 91,
    stock: 44,
    shortDescription: "Clean Scandinavian low-top court sneaker in monochrome blush pink calfskin leather with sleek tone-on-tone sole.",
    Description: {
      Item_code: "TS-WS-106",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Italian Calf Leather",
      Sole_material: "Margom-Style Italian Rubber Sole",
      Color: "Pastel Pink",
      product: [
        "Streamlined monochrome silhouette with zero exterior branding",
        "Full calfskin interior lining for barefoot luxury",
        "Removable dual-density molded polyurethane footbed",
        "Waxed flat cotton tonal laces"
      ]
    }
  },
  {
    name: "Trail-Grip Outdoor Running Shoe Sand & Sage",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    price: 4500,
    star: 5,
    Discount: 18,
    selling: 56,
    stock: 26,
    shortDescription: "Rugged all-weather trail runner equipped with chevron mud lugs, reinforced toe rock plate, and water-repellent ripstop upper.",
    Description: {
      Item_code: "TS-WS-107",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Water-Shield Ballistic Ripstop & TPU",
      Sole_material: "Vibram-Inspired Multi-Directional Lug Rubber",
      Color: "Sand Beige & Sage Green",
      product: [
        "5mm chevron multi-directional lugs bite into wet mud & gravel",
        "Protective TPU rock plate shields soles from sharp stone bruises",
        "Quick-pull bungee lacing with lace stash tongue pocket",
        "Reflective nocturnal safety accents"
      ]
    }
  },
  {
    name: "Metallic Accent Aerobic Gym Sneaker Rose Gold",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    price: 3950,
    star: 5,
    Discount: 15,
    selling: 82,
    stock: 37,
    shortDescription: "Cross-training studio sneaker with rose gold metallic heel cup, lateral stability wraps, and high-impact forefoot cushion.",
    Description: {
      Item_code: "TS-WS-108",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Metallic Polyurethane & Air Knit Mesh",
      Sole_material: "Non-Marking Studio Gum Rubber",
      Color: "Rose Gold & Pearl White",
      product: [
        "Gleaming rose gold chrome heel counter locks foot during squats",
        "Non-marking pivot point rubber sole ideal for dance & aerobics",
        "Wide toe-box allows natural toe splay under heavy load",
        "Anti-slip tongue with lace anchor loop"
      ]
    }
  },
  {
    name: "Speed-Stride Carbon-Plate Road Racer Peach Burst",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    price: 4950,
    star: 5,
    Discount: 10,
    selling: 73,
    stock: 25,
    shortDescription: "Elite marathon racing shoe equipped with a curved full-length carbon-fiber flyplate and hyper-reactive PEBA super-foam.",
    Description: {
      Item_code: "TS-WS-109",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Ultrathin Translucent Monomesh",
      Sole_material: "Full-Length Carbon Fiber Plate & PEBA Foam",
      Color: "Peach Burst & Solar Yellow",
      product: [
        "Curved 3K carbon-fiber plate propels forward propulsion",
        "Supercritical PEBA foam delivers 87% bouncy energy return",
        "Ultralight 165g race-day aerodynamic weight",
        "Micro-perforated racer tongue dissipates heat rapidly"
      ]
    }
  },
  {
    name: "Vintage Suede-Trim Trainer Ocean Blue & Ivory",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    price: 3450,
    star: 5,
    Discount: 20,
    selling: 85,
    stock: 38,
    shortDescription: "1970s track nostalgia runner featuring rich ocean blue nylon panels, hairy ivory suede trims, and tapered gum waffle outsoles.",
    Description: {
      Item_code: "TS-WS-110",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Vintage Nylon & Shaggy Calf Suede",
      Sole_material: "EVA Wedge Midsole & Gum Waffle Outsole",
      Color: "Ocean Blue & Ivory",
      product: [
        "Retro track runner wedge silhouette with exposed foam tongue",
        "Iconic gum waffle tread wraps over the toe bumper",
        "Plush terrycloth towel lining absorbs sweat",
        "Classic low-profile look pairs effortlessly with jeans or skirts"
      ]
    }
  },
  {
    name: "Zero-Gravity Lightweight Walking Shoe Triple White",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    price: 3300,
    star: 5,
    Discount: 10,
    selling: 112,
    stock: 55,
    shortDescription: "Clean triple-white all-day walking shoe engineered with cloudpod cushioning and elastic speed-lacing for commute ease.",
    Description: {
      Item_code: "TS-WS-111",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Engineered Antimicrobial Mesh",
      Sole_material: "Zero-Gravity Individual Cloud Pod EVA",
      Color: "Triple White",
      product: [
        "Individual hollow cloud pods adapt dynamically to your stride",
        "Hands-free slip-on entry with elastic speed laces",
        "Antimicrobial breathable mesh keeps feet odor-free",
        "Recommended by podiatrists for prolonged standing"
      ]
    }
  },
  {
    name: "Monochrome Street-Style Platform Jet Black",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    price: 4100,
    star: 5,
    Discount: 15,
    selling: 78,
    stock: 36,
    shortDescription: "Gothic modern all-black athletic sneaker with double-stacked 45mm platform sole, glossy patent accents, and tonal rope laces.",
    Description: {
      Item_code: "TS-WS-112",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Matte Leather, Patent Panels & Heavy Canvas",
      Sole_material: "Double-Height Solid Rubber Platform",
      Color: "Pitch Jet Black",
      product: [
        "45mm bold flatform delivers dramatic height elevation",
        "Tone-on-tone matte and patent textural contrast",
        "Padded ankle collar with soft microfiber lining",
        "Anti-slip razor tread outsole"
      ]
    }
  },
  {
    name: "Breathable Aeromesh Distance Runner Glacier Blue",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    price: 3750,
    star: 5,
    Discount: 12,
    selling: 66,
    stock: 32,
    shortDescription: "Long-distance daily trainer in icy glacier blue, sporting high-ventilation open aeromesh and ultra-responsive responsive foam.",
    Description: {
      Item_code: "TS-WS-113",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Dual-Layer Open Aeromesh & No-Sew Overlays",
      Sole_material: "Rebound-Tech Midsole & Blown Rubber Outsole",
      Color: "Glacier Blue & White",
      product: [
        "Open-pore aeromesh keeps foot temperate even in high humidity",
        "Midfoot saddle band delivers secure containment",
        "Beveled heel landing promotes smooth heel-to-toe gait",
        "Reflective logos for predawn/evening jogs"
      ]
    }
  },
  {
    name: "Flex-Motion Cross-Trainer Plum & Gold",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40],
    mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    price: 4150,
    star: 5,
    Discount: 15,
    selling: 59,
    stock: 28,
    shortDescription: "Versatile gym cross-trainer designed for HIIT, box jumps, and sprints with flexible multidirectional sole and rich plum tones.",
    Description: {
      Item_code: "TS-WS-114",
      Brand: "Trends Shop Athletics",
      Upper_Material: "Abrasion-Resistant Ripstop & Suede",
      Sole_material: "Multi-Flex Hexagonal Grooved Rubber Sole",
      Color: "Deep Plum & Metallic Gold",
      product: [
        "Hexagonal flex-grooves expand in all directions naturally",
        "Rope-wrap medial rubber guard withstands gym wear",
        "Wide flat heel creates stable lifting base",
        "Comfort foam inner ankle collar"
      ]
    }
  },
  {
    name: "Reflective Nocturnal City Runner Silver Luminescence",
    category: "WOMEN'S SPORT",
    gender: "WOMEN'S",
    seller: "Trends Shop Athletics",
    size: [36, 37, 38, 39, 40, 41],
    mainImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    thirdImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    fourthImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
    price: 4600,
    star: 5,
    Discount: 10,
    selling: 64,
    stock: 24,
    shortDescription: "Sleek nighttime city running sneaker covered in 3M Scotchlite reflective fabric that blazes under headlights with hydro-shield coating.",
    Description: {
      Item_code: "TS-WS-115",
      Brand: "Trends Shop Athletics",
      Upper_Material: "3M Scotchlite Reflective Fabric & Leather",
      Sole_material: "Hydro-Trek Lug Rubber & Dual EVA",
      Color: "Silver Metallic & Pearl White",
      product: [
        "360-degree high-intensity retro-reflective upper",
        "Hydro-shield water-repellent exterior treatment",
        "Anti-torsion TPU midfoot stabilizer bar",
        "Antimicrobial molded ortholite footbed"
      ]
    }
  }
];

// Combine all 45 products and set cateimg to mainImage
const all45WomenProducts = [
  ...formalProducts.map(p => ({ ...p, cateimg: p.mainImage })),
  ...casualProducts.map(p => ({ ...p, cateimg: p.mainImage })),
  ...sportProducts.map(p => ({ ...p, cateimg: p.mainImage }))
];

async function seed45WomenShoes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('TrendsShop');
    const shoesCol = db.collection('shoes');

    console.log(`Inserting ${all45WomenProducts.length} new luxury women footwear products...`);
    const result = await shoesCol.insertMany(all45WomenProducts);
    console.log(`Successfully added ${result.insertedCount} women's products!`);

    const totalCount = await shoesCol.countDocuments();
    console.log(`Total footwear products now in database: ${totalCount}`);

    // Print breakdown
    const formalCount = await shoesCol.countDocuments({ category: "WOMEN'S FORMAL" });
    const casualCount = await shoesCol.countDocuments({ category: "WOMEN'S CASUAL" });
    const sportCount = await shoesCol.countDocuments({ category: "WOMEN'S SPORT" });
    console.log(`Women's Counts -> WOMEN'S FORMAL: ${formalCount}, WOMEN'S CASUAL: ${casualCount}, WOMEN'S SPORT: ${sportCount}`);
  } finally {
    await client.close();
  }
}

seed45WomenShoes().catch(console.error);
