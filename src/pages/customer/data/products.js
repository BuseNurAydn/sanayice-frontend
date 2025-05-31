export const categories = [
  "Elektronik", "Ev & Yaşam", "Yapı Market", "Ofis", "Kırtasiye", "Otomotiv", "Hobi", "Moda", "Spor", "Kozmetik"
];
// 1. Örnek kart verileri
export const cards1 = [
  { title: "Hizmet A", desc: "Bu bir açıklamadır.", image: "https://via.placeholder.com/300x200" },
  { title: "Hizmet B", desc: "Bu bir açıklamadır.", image: "https://via.placeholder.com/300x200" },
  { title: "Hizmet C", desc: "Bu bir açıklamadır.", image: "https://via.placeholder.com/300x200" }
];

export const cards2 = [
  { title: "Hizmet X", desc: "Bu bir açıklamadır.", image: "https://via.placeholder.com/300x200" },
  { title: "Hizmet Y", desc: "Bu bir açıklamadır", image: "https://via.placeholder.com/300x200" },
  { title: "Hizmet Z", desc: "Bu bir açıklamadır", image: "https://via.placeholder.com/300x200" }
];

export const brands = [
  { name: "Apple", logo: "/brands/apple.png" },
  { name: "Samsung", logo: "/brands/samsung.png" },
  { name: "Siemens", logo: "/brands/siemens.png" },
  { name: "Bosch", logo: "/brands/bosch.png" },
  { name: "Arçelik", logo: "/brands/arcelik.png" },
  { name: "Vestel", logo: "/brands/vestel.png" },
  { name: "LG", logo: "/brands/lg.png" },
  { name: "Sony", logo: "/brands/sony.png" }
];

export const featuredProducts = [
  { id: 1, name: "iPhone 15 Pro Max", price: 65000, oldPrice: 75000, image: "/products/iphone15pro.png", badge: "YENİ" },
  { id: 2, name: "MacBook Air M3", price: 42000, oldPrice: 48000, image: "/products/macbookair.png", badge: "İNDİRİM" },
  { id: 3, name: "AirPods Pro 2", price: 9500, oldPrice: 12000, image: "/products/airpodspro.png", badge: "POPÜLER" },
  { id: 4, name: "Samsung S24 Ultra", price: 58000, oldPrice: 65000, image: "/products/s24ultra.png", badge: "YENİ" },
  { id: 5, name: "iPad Pro", price: 35000, oldPrice: 42000, image: "/products/ipadpro.png", badge: "İNDİRİM" },
  { id: 6, name: "Apple Watch S9", price: 15000, oldPrice: 18000, image: "/products/applewatch.png", badge: "POPÜLER" }
];

export const discountedProducts = [
  {id: 7, name: "Dyson V15", price: 8500, oldPrice: 12000, discount: 30, image: "/products/dyson.png" },
  {id: 8, name: "Philips Airfryer", price: 2100, oldPrice: 3000, discount: 30, image: "/products/airfryer.png" },
  {id: 9, name: "Tefal Cookware Set", price: 1200, oldPrice: 1800, discount: 33, image: "/products/tefal.png" },
  {id: 10, name: "Braun Epilator", price: 800, oldPrice: 1200, discount: 33, image: "/products/braun.png" },
  {id: 11, name: "Karcher Basınçlı Yıkama", price: 2800, oldPrice: 4000, discount: 30, image: "/products/karcher.png" },
  {id: 12, name: "Bosch Vidalama Seti", price: 450, oldPrice: 650, discount: 31, image: "/products/bosch-tools.png" }
];

export const newProducts = [
  {id: 13, name: "Steam Deck OLED", price: 18000, image: "/products/steamdeck.png", isNew: true },
  {id: 14, name: "PlayStation Portal", price: 8500, image: "/products/psportal.png", isNew: true },
  {id: 15, name: "Meta Quest 3", price: 22000, image: "/products/quest3.png", isNew: true },
  {id: 16, name: "Nintendo Switch OLED", price: 12000, image: "/products/switch.png", isNew: true },
  {id: 17, name: "Asus ROG Ally", price: 25000, image: "/products/rogally.png", isNew: true },
  {id: 18,name: "Framework Laptop", price: 45000, image: "/products/framework.png", isNew: true }
];

export const categoryCards = [
  {
    title: "Elektronik",
    description: "Teknoloji Ürünleri",
    image: "/categories/elektronik.png",
    productCount: "2.500+ Ürün"
  },
  {
    title: "Ev & Yaşam",
    description: "Ev Eşyaları",
    image: "/categories/ev-yasam.png",
    productCount: "5.200+ Ürün"
  },
  {
    title: "Yapı Market",
    description: "İnşaat & Bahçe",
    image: "/categories/yapi-market.png",
    productCount: "8.100+ Ürün"
  },
  {
    title: "Moda & Giyim",
    description: "Kıyafet & Aksesuar",
    image: "/categories/moda.png",
    productCount: "3.800+ Ürün"
  },
  {
    title: "Spor & Outdoor",
    description: "Spor Malzemeleri",
    image: "/categories/spor.png",
    productCount: "1.900+ Ürün"
  },
  {
    title: "Otomotiv",
    description: "Araç Aksesuarları",
    image: "/categories/otomotiv.png",
    productCount: "4.600+ Ürün"
  }
];

