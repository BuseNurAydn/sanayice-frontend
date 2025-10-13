import resim1 from "../assets/png/İNDİRİM - 1.png";
import resim2 from "../assets/png/İNDİRİM - 2.png";
import resim3 from "../assets/png/İNDİRİM - 3.png";
import resim4 from "../assets/png/İNDİRİM - 4.png";
import resim5 from "../assets/png/İNDİRİM - 5.png";
import resim6 from "../assets/png/İNDİRİM - 6.png";
import resim7 from "../assets/png/İNDİRİM - 7.png";
import resim8 from "../assets/png/İNDİRİM - 8.png";
import resim9 from "../assets/png/İNDİRİM - 9.png";
import resim10 from "../assets/png/İNDİRİM - 10.png";
import resim11 from "../assets/png/İNDİRİM - 11.png";

export const categories = [
  { id: 1, name: "Yeni Gelenler", imageUrl: resim1, link: "yeni-gelenler", endpoint: "/public/products/new?days=7" },
  { id: 2, name: "Teknoloji", imageUrl: resim2, link: "teknoloji", endpoint:"/products/categories/18" },
  { id: 3, name: "Avantajlı Ürünler", imageUrl: resim3, link: "avantajli-urunler", endpoint:"/public/products/discounted"},
  { id: 4, name: "Çok Satanlar", imageUrl: resim4, link: "cok-satanlar", endpoint: "/public/products/best-selling?limit=20" },
  { id: 5, name: "Kargo Bedava", imageUrl: resim5, link: "kargo-bedava", endpoint:"/public/products/free-shipping" },
  { id: 6, name: "Fırsat Ürünleri", imageUrl: resim6, link: "firsat-urunleri", endpoint:"/public/products/featured" },
  { id: 7, name: "Ustaya Göre", imageUrl: resim7, link: "ustaya-gore",endpoint:"/products/categories/19" },
  { id: 8, name: "Tüm Kategoriler", imageUrl: resim8, link: "tum-kategoriler",endpoint:"/products" },
  { id: 9, name: "Favoriler", imageUrl: resim9, link: "favoriler", endpoint:"/public/products/popular?limit=20" },
  { id: 10, name: "Hemen Al", imageUrl: resim10, link: "hemen-al",  endpoint:"/public/products/discounted" },
  { id: 11, name: "Fiyatı Düşenler", imageUrl: resim11, link: "fiyati-dusenler", endpoint:"/public/products/discounted" }
];

