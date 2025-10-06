import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { categories } from "../../constants/categories";
import { API_BASE } from "../../config";
import ProductCard from "../../components/ProductCard";

// Skeleton
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 w-3/4 rounded mb-2"></div>
    <div className="h-6 bg-orange-300 w-1/2 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 w-full rounded-lg"></div>
  </div>
);

// Filtre Section Component
const FilterSection = ({ title, children }) => (
  <div className="border-b border-gray-200 py-3">
    <h3 className="text-md font-semibold text-gray-700">{title}</h3>
    <div className="mt-2 text-sm max-h-60 overflow-y-auto space-y-1">
      {children}
    </div>
  </div>
);

const DiscoverPage = () => {
  const { slug } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filtreler
  const [filters, setFilters] = useState({
    brands: [],
    minPrice: "",
    maxPrice: "",
  });

  // sıralama
  const [sortOption, setSortOption] = useState("recommended");

  // marka gösterme kontrolü
  const [showAllBrands, setShowAllBrands] = useState(false);

  const category = categories.find((cat) => cat.link === slug);

  // Fiyat aralığı (dinamik sınırlar)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  useEffect(() => {
    if (!category?.endpoint) {
      setLoading(false);
      setError("Kategori için API yolu (endpoint) tanımlanmamış.");
      return;
    }

    setLoading(true);

    fetch(`${API_BASE}${category.endpoint}`)
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorText) => {
            console.error(`API Hata Detayı (${res.status}):`, errorText);
            throw new Error(`HTTP Hata! Kod: ${res.status}. Detaylar konsolda.`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setAllProducts(data);
        setProducts(data);

        // ürünlerden min ve max fiyatı hesapla
        const prices = data.map((p) => p.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setPriceRange({ min, max });
        setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));

        setError(null);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError(err.message || "Bilinmeyen bir hata oluştu.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, category?.endpoint]);

  // Dinamik markalar (ve ürün sayısı)
  const brands = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([brand, count]) => ({ brand, count }));
  }, [allProducts]);

  // Filtreleme + sıralama logic
  useEffect(() => {
    let filtered = [...allProducts];

    // Marka filtre
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }

    // Fiyat filtre
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Sıralama
    switch (sortOption) {
      case "bestSeller":
        filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      case "highPrice":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "lowPrice":
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    setProducts(filtered);
  }, [filters, sortOption, allProducts]);

  if (!category) {
    return (
      <h1 className="text-4xl p-10 text-center font-bold text-red-700">
        404 - Kategori bulunamadı
      </h1>
    );
  }

  if (error && !loading) {
    return (
      <div className="container mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {category.name}
        </h1>
        <p className="text-xl text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6 min-h-screen">
      {/* Header */}
      <header className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-gray-800">{category.name} </h1>
        <div className="flex space-x-3 mt-3">
          <button className="flex items-center text-sm font-medium px-3 py-1 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition">
            ⚡️ Flaş Ürünler
          </button>
          <button className="flex items-center text-sm font-medium px-3 py-1 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition">
            ⭐ Yüksek Puanlı Satıcılar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SOL KOLON: Filtreler */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Filtrele</h2>

            {/* Marka Filtresi */}
            <FilterSection title="Marka">
              {brands
                .slice(0, showAllBrands ? brands.length : 5)
                .map(({ brand, count }) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters((prev) => ({
                            ...prev,
                            brands: [...prev.brands, brand],
                          }));
                        } else {
                          setFilters((prev) => ({
                            ...prev,
                            brands: prev.brands.filter((x) => x !== brand),
                          }));
                        }
                      }}
                    />
                    <span className="text-gray-700">
                      {brand} <span className="text-gray-400">({count})</span>
                    </span>
                  </label>
                ))}

              {brands.length > 5 && (
                <button
                  onClick={() => setShowAllBrands((prev) => !prev)}
                  className="text-orange-500 text-sm mt-2"
                >
                  {showAllBrands ? "Daha Az Göster" : "Daha Fazla Göster"}
                </button>
              )}
            </FilterSection>

            {/* Fiyat Aralığı */}
            <FilterSection title="Fiyat Aralığı">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  min={priceRange.min}
                  max={filters.maxPrice || priceRange.max}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                  className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  min={filters.minPrice || priceRange.min}
                  max={priceRange.max}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                  className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Max"
                />
              </div>

              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={100}
                value={filters.maxPrice || priceRange.max}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value,
                  }))
                }
                className="w-full"
              />
              <p className="text-sm mt-1">
                {filters.minPrice} TL - {filters.maxPrice} TL
              </p>
            </FilterSection>

            {/* Alt Kategoriler */}
            <FilterSection title="Alt Kategoriler">
              <ul className="space-y-1 text-sm text-gray-700">
                <li><a href="#" className="hover:text-orange-500"> Alt Kategori 1 </a></li>
                <li><a href="#" className="hover:text-orange-500"> Alt Kategori 2</a></li>
                <li><a href="#" className="hover:text-orange-500">Alt Kategori 3</a></li>
              </ul>
            </FilterSection>

            <button
              onClick={() =>
                setFilters({
                  brands: [],
                  minPrice: priceRange.min,
                  maxPrice: priceRange.max,
                })
              }
              className="mt-4 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Filtreleri Temizle
            </button>
          </div>
        </aside>

        {/* SAĞ KOLON: Ürünler */}
        <main className="lg:col-span-9">
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md border-t-4 border-orange-500">
            <p className="text-md text-gray-700">
              {loading
                ? "Ürünler yükleniyor..."
                : `Toplam ${products.length} ürün listeleniyor.`}
            </p>
            <select
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="recommended">Önerilen Sıralama</option>
              <option value="bestSeller">En Çok Satanlar</option>
              <option value="highPrice">Fiyat: Yüksekten Düşüğe</option>
              <option value="lowPrice">Fiyat: Düşükten Yükseğe</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
            ) : products.length > 0 ? (
              products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))
            ) : (
              <p className="col-span-full text-center text-xl text-gray-500 py-10">
                Bu kategoride listelenecek aktif ürün bulunmamaktadır.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DiscoverPage;

