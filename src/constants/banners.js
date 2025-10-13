import banner1 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 13.png";
import banner2 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 14.png";
import banner3 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 15.png";
import banner4 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 16.png";
import banner5 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 17.png";
import banner6 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 18.png";
import banner7 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 19.png";
import banner8 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 20.png";
import banner9 from "../assets/png/Profesyoneller İçim Hassas Ölçüler - 21.png";

export const groupedBanners = [
  [
    { id: 1, imageUrl: banner1, name: "Doğru Ölçü Doğru Sonuç" ,link:"dogru-olcu", endpoint: "/public/products/filter?isFeatured=true" },
    { id: 2, imageUrl: banner2, name:"Atölyene Güç Kat" ,link:"atolyene-guc-kat", endpoint: "/public/products/filter?hasDiscount=true" },
    { id: 3, imageUrl: banner3, name:"Enerjini Burdan Al", link:"enerjini-burdan-al", endpoint: "/public/products/filter?freeShipping=true" },
  ],
  [
    { id: 4, imageUrl: banner4,  name:"Önce Güvenlik", link:"guvenlik", endpoint: "/public/products/filter?categoryId=1" },
    { id: 5, imageUrl: banner5,  name:"Usta Malzemeleri", link:"usta-malzemeleri", endpoint: "/public/products/filter?isFeatured=true&categoryId=5" },
    { id: 6, imageUrl: banner6,  name:"Sanayi Burada", link:"sanayi", endpoint: "/public/products/filter?hasDiscount=true&freeShipping=true" },
  ],
  [
    { id: 7, imageUrl: banner7,  name:"Kesici Çözümler", link:"kesici-cozumler", endpoint: "/public/products/filter?categoryId=1&subcategoryId=5&hasDiscount=true" },
    { id: 8, imageUrl: banner8,  name:"Kontrol Elinde", link:"kontrol-elinde", endpoint: "/public/products/filter?isFeatured=true&hasDiscount=true&freeShipping=true&categoryId=1&subcategoryId=3" },
    { id: 9, imageUrl: banner9,  name:"Elindeki Güç", link:"elindeki-guc", endpoint: "/public/products/filter?isFeatured=true" },
  ]
];
