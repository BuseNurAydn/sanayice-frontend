import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoriesMenu from "./CategoriesMenu";
import { fetchCategories } from "../services/categoryService";
import { TfiAlignLeft } from "react-icons/tfi";
import { generateCategoryUrl } from "../utils/urlHelpers";

const HeaderCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    };
    loadCategories();
  }, []);

  // ilk 8 tanesini alıyoruz
  const featuredCategories = categories.slice(0, 7);

  return (
    <div className="relative bg-white shadow ">
      <div className="container mx-auto max-w-7xl hidden md:flex items-center gap-8 py-3 text-sm ">
        {/* Tüm Kategoriler */}
        <div
          className="relative"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button className="flex justify-center items-center gap-2 px-4 py-2 text-black font-medium rounded-md  transition text-sm cursor-pointer hover:text-orange-600">
            <TfiAlignLeft />
            TÜM KATEGORİLER
          </button>

          {/* Hover ile açılan menü */}
          {isOpen && (
            <div className="absolute left-0 top-full z-20 pt-3.5">
              <CategoriesMenu />
            </div>
          )}
        </div>

        {/* Öne çıkan kategoriler */}
        <div className="flex gap-4">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={generateCategoryUrl(cat)}
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderCategories;
