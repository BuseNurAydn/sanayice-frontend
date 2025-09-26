import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import resim1 from "../assets/png/İNDİRİM - 1.jpg"
import resim2 from "../assets/png/İNDİRİM - 2.jpg"
import resim3 from "../assets/png/İNDİRİM - 3.jpg"
import resim4 from "../assets/png/İNDİRİM - 4.jpg"
import resim5 from "../assets/png/İNDİRİM - 5.jpg"
import resim6 from "../assets/png/İNDİRİM - 6.jpg"
import resim7 from "../assets/png/İNDİRİM - 7.jpg"
import resim8 from "../assets/png/İNDİRİM - 8.jpg"
import resim9 from "../assets/png/İNDİRİM - 9.jpg"
import resim10 from "../assets/png/İNDİRİM - 10.jpg"
import resim11 from "../assets/png/İNDİRİM - 11.jpg"

const categories = [
  { id: 1, name: "Yeni Gelenler", imageUrl: resim1, link: "/yeni-gelenler" },
  { id: 2, name: "Teknoloji", imageUrl: resim2, link: "/teknoloji" },
  { id: 3, name: "Avantajlı Ürünler", imageUrl: resim3, link: "/avantajli-urunler" },
  { id: 4, name: "Çok Satanlar", imageUrl: resim4, link: "/cok-satanlar" },
  { id: 5, name: "Kargo Bedava", imageUrl: resim5, link: "/kargo-bedava" },
  { id: 6, name: "Fırsat Ürünleri", imageUrl: resim6, link: "/firsat-urunleri" },
  { id: 7, name: "Ustaya Göre", imageUrl: resim7, link: "/ustaya-gore" },
  { id: 8, name: "Tüm Kategoriler", imageUrl: resim8, link: "/tum-kategoriler" },
  { id: 9, name: "Favoriler", imageUrl: resim9, link: "/favoriler" },
  { id: 10, name: "Hemen Al", imageUrl: resim10, link: "/hemen-al" },
  { id: 11, name: "Fiyatı Düşenler", imageUrl: resim11, link: "/fiyati-dusenler" }
];

const Discover = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth - 100;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full md:px-8 py-4">
      <div className="container mx-auto max-w-7xl relative flex items-center">
        
        {/* Sol Ok */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hidden md:flex items-center justify-center hover:bg-orange-100 transition"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Kategoriler */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth flex-1 mx-4"
        >
          <ul className="flex gap-6 justify-center min-w-max">
            {categories.map((cat) => (
              <li key={cat.id} className="flex flex-col items-center min-w-[90px]">
                <a
                  href={cat.link}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-15 h-15 rounded-full overflow-hidden flex items-center justify-center group-hover:shadow-lg group-hover:border-orange-400 transition">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 text-center group-hover:text-orange-500">
                    {cat.name}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sağ Ok */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hidden md:flex items-center justify-center hover:bg-orange-100 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Discover;


