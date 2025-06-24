import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../services/categoryService';
import CategoryCard from '../../components/CategoryCard';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Kategorileri getir
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Kategoriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Kategorileri filtrele
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "with-sub" && category.subcategories?.length > 0) ||
                         (selectedFilter === "no-sub" && (!category.subcategories || category.subcategories.length === 0));
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold text-lg mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Arama ve Filtreler */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Arama */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hangi kategoriyi arıyorsunuz?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white/70 backdrop-blur-sm text-lg"
                />
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtreler */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  selectedFilter === "all" 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                    : "bg-white/70 text-gray-700 hover:bg-white border-2 border-gray-200"
                }`}
              >
                Tümü ({categories.length})
              </button>
              <button
                onClick={() => setSelectedFilter("with-sub")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  selectedFilter === "with-sub" 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                    : "bg-white/70 text-gray-700 hover:bg-white border-2 border-gray-200"
                }`}
              >
                Alt Kategorili ({categories.filter(c => c.subcategories?.length > 0).length})
              </button>
            </div>
          </div>
        </div>

        {/* Kategoriler Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => (
              <div key={category.id} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50 overflow-hidden">
                  
                  {/* Ana Kategori */}
                  <div className="p-6">
                    <CategoryCard category={category} index={index} />
                  </div>
                  
                  {/* Alt kategoriler varsa */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900">
                          Alt Kategoriler ({category.subcategories.length})
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {category.subcategories.slice(0, 6).map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/subcategory/${sub.id}`}
                            className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-xl transition-all duration-200 group/sub"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full group-hover/sub:scale-125 transition-transform"></div>
                            <span className="font-medium">{sub.name}</span>
                            <svg className="w-4 h-4 ml-auto opacity-0 group-hover/sub:opacity-100 transform translate-x-1 group-hover/sub:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                        
                        {category.subcategories.length > 6 && (
                          <div className="px-4 py-2 text-center">
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              +{category.subcategories.length - 6} tane daha
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-white/50">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kategori bulunamadı</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `"${searchTerm}" araması için sonuç bulunamadı.` 
                  : "Seçili filtreye uygun kategori bulunamadı."
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;