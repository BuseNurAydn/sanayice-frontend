import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { TfiAngleRight } from "react-icons/tfi";

const CategoriesMenu = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        // İlk kategoriyi otomatik olarak seç
        if (data.length > 0) setHoveredCategory(data[0]);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="relative flex">
      {/* Sol taraf: Ana kategoriler */}
      <div className="w-64 bg-gray-50 border-r border-gray-200" id="leftMenu">
        <ul>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`px-4 py-3 cursor-pointer hover:bg-white flex justify-between hover:text-orange-600 ${hoveredCategory?.id === cat.id ? "bg-white text-orange-600" : ""
                }`}
              onMouseEnter={() => setHoveredCategory(cat)}
            >
              <Link
                to={`/kategori/${cat.id}`}
                className={`font-medium text-gray-700 hover:text-orange-600 ${hoveredCategory?.id === cat.id ? "text-orange-600" : ""
                  }`}
              >
                {cat.name}
              </Link>
              <TfiAngleRight />
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ taraf: Alt kategoriler */}
      {hoveredCategory && hoveredCategory.subcategories?.length > 0 && (
        <div
          className="absolute w-[360px] left-64 top-0 bg-white shadow-xl rounded-b-md p-4 flex flex-col gap-6 justify-start z-20"
          style={{
            height: document.getElementById("leftMenu")?.offsetHeight || "auto",
          }}
        >
          {hoveredCategory.subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/alt-kategori/${sub.id}`}
              className="block font-semibold text-gray-800 hover:text-orange-600"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesMenu;
