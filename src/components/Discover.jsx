import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { id: 1, name: "Yeni Gelen Ürünler", imageUrl: "", link: "/yeni-gelen" },
  { id: 2, name: "İndirim Kuponlarım", imageUrl: "", link: "/kuponlar" },
  { id: 3, name: "Fırsatlı Ürünler", imageUrl: "", link: "/firsatlar" },
  { id: 4, name: "Avantajlı Ürünler", imageUrl: "", link: "/avantajli" },
  { id: 5, name: "Sende Al", imageUrl: "", link: "/sendeal" },
  { id: 6, name: "Krediler", imageUrl: "", link: "/krediler" },
  { id: 7, name: "Kredi Kartı", imageUrl: "", link: "/kredi-karti" },
  { id: 8, name: "Kampanyalar", imageUrl: "", link: "/kampanyalar" },
  { id: 9, name: "Kampanyalar", imageUrl: "", link: "/kampanyalar" },
  { id: 10, name: "Kampanyalar", imageUrl: "", link: "/kampanyalar" }
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
      <div className="container mx-auto relative flex items-center">
        
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
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 group-hover:shadow-lg group-hover:border-orange-400 transition">
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


