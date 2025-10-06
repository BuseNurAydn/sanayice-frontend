import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "../constants/categories"; 

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
          className="overflow-x-auto scrollbar-hide scroll-smooth flex-1 md:mx-4"
        >
          <ul className="flex gap-2 md:gap-6 justify-center min-w-max">
            {categories.map((cat) => (
              <li key={cat.id} className="flex flex-col items-center min-w-[90px]">
                <Link to={`/discover/${cat.link}`}
                  href={cat.link}
                  className="flex flex-col items-center group"
                >
                  <div className="w-15 h-15 rounded-full overflow-hidden flex items-center justify-center group-hover:shadow-lg group-hover:border-orange-600 transition">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 text-center group-hover:text-orange-500">
                    {cat.name}
                  </p>
                </Link>
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


