import { useParams } from "react-router-dom";
import { useEffect, useState} from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { groupedBanners } from "../../constants/banners";
import { API_BASE } from "../../config";
import ProductCard from "../../components/ProductCard";
import useProductFiltering from '../../hooks/useProductFiltering';
import ProductFilterSidebar from '../../components/ProductFilterSidebar';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 w-3/4 rounded mb-2"></div>
    <div className="h-6 bg-orange-300 w-1/2 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 w-full rounded-lg"></div>
  </div>
);

const BannerPage = () => {
  const { slug } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [showAllOptions, setShowAllOptions] = useState(false); // Marka/Kategori için tek bir state kullanılıyor.

  const allBanners = groupedBanners.flat();
  const category = allBanners.find((b) => b.link === slug);

  // Mobil Filtre ve Sıralama State'leri
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);


  useEffect(() => {
    if (!category?.endpoint) {
      setLoading(false);
      setError("Kategori için API yolu (endpoint) tanımlanmamış.");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}${category.endpoint}`)
      .then((res) => {
        if (!res.ok) return res.text().then((text) => { throw new Error(`API Hata! Kod: ${res.status}. Detay: ${text}`); });
        return res.json();
      })
      .then((data) => {
        setAllProducts(data);
      
        if (data.length > 0) {
          const prices = data.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange({ min, max });
        } else {
          setPriceRange({ min: 0, max: 0 });
        }

        setError(null);
      })
      .catch((err) => { console.error("API error:", err); setError(err.message || "Bilinmeyen hata"); })
      .finally(() => setLoading(false));
  }, [slug, category?.endpoint]);

  // ÖZEL KANCA
  const {
    products, // Filtrelenmiş ve sıralanmış ürünler
    filters,
    setFilters,
    sortOption,
    setSortOption,
    activeFilterCount,
    clearFilters,
  } = useProductFiltering(allProducts, priceRange);


  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 min-h-screen">

      {/* BAŞLIK VE MOBİL BUTONLAR */}
      <div className="pb-4 sm:p-0 ">
        {/* Mobilde Başlık ve Bilgi */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">{category.name}</h1>
          <p className="text-sm text-gray-700">
            {loading ? "Yükleniyor..." : `(${products.length} ürün)`}
          </p>
        </div>

        {/* Mobilde filtre ve sıralama butonları */}
        <div className="lg:hidden flex gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold flex-1 flex items-center justify-center gap-2 cursor-pointer transition hover:bg-orange-600"
          >
            <FaFilter />
            <span>Filtrele</span>
            {activeFilterCount > 0 && (
              <span className="text-xs bg-white text-orange-600 px-2 py-0.5 rounded-full">
                {activeFilterCount} aktif
              </span>
            )}
          </button>

          {/* Sırala Butonu ( mobilde panel) */}
          <button
            onClick={() => setIsSortOpen(true)}
            className="bg-gray-50 text-orange-600 py-2 px-4 rounded-lg font-semibold flex-1 flex items-center justify-center gap-2 cursor-pointer border border-gray-300 transition hover:bg-gray-200"
          >
            <span>Sırala</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 10h14M3 16h10" />
            </svg>
          </button>
        </div>
      </div>

      {/* ANA İÇERİK: Grid yapısı */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SOL KOLON: Filtreler */}
        <aside className="lg:col-span-3 hidden lg:block">
          <ProductFilterSidebar
            allProducts={allProducts}
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            priceRange={priceRange}
          />
        </aside>

        {/* SAĞ KOLON: Ürünler */}
        <main className="lg:col-span-9">

          {/* Masaüstü Sıralama ve Üst Banner */}
          <div className="hidden lg:flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md border-t-4 border-orange-500">
            <div className="flex gap-2 items-center">
              <h1 className="text-xl font-bold text-gray-800">{category?.name || "Tüm Ürünler"}</h1>
              <p className="text-md text-gray-700">
                {loading
                  ? "Ürünler yükleniyor..."
                  : `(${products.length} ürün)`}
              </p>
            </div>

            <select className="border border-gray-300 outline-none rounded-lg p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
              value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option value="recommended">Önerilen Sıralama</option>
              <option value="bestSeller">En Çok Satanlar</option>
              <option value="highPrice">Fiyat: Yüksekten Düşüğe</option>
              <option value="lowPrice">Fiyat: Düşükten Yükseğe</option>
            </select>
          </div>

          <div className="mb-6 border-b border-gray-200 pb-4 hidden lg:block">
            <div className="flex space-x-3 mt-3">
              <button className="flex items-center text-sm font-medium px-3 py-1 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition">⚡️ Flaş Ürünler </button>

              <button className="flex items-center text-sm font-medium px-3 py-1 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition"> ⭐ Yüksek Puanlı Satıcılar </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
              : products.length
                ? products.map(p => <ProductCard key={p.id} product={p} />)
                : <p className="col-span-full text-center text-xl text-gray-500 py-10">Filtre kriterlerinize uyan ürün bulunmamaktadır.</p>
            }
          </div>
        </main>
      </div>

      {/** Mobilde sıralama */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-40 flex items-center justify-center lg:hidden transition-opacity duration-300">
          <div className="bg-white w-full max-w-sm rounded-t-xl md:rounded-lg p-4 shadow-xl transform translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 text-center">Sırala</h3>
            <div className="space-y-2">
              {[
                { label: "Önerilen Sıralama", value: "recommended" },
                { label: "En Çok Satanlar", value: "bestSeller" },
                { label: "Fiyat: Yüksekten Düşüğe", value: "highPrice" },
                { label: "Fiyat: Düşükten Yükseğe", value: "lowPrice" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOption(option.value);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition text-base ${sortOption === option.value
                    ? "bg-orange-100 text-orange-700 font-semibold border border-orange-300"
                    : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsSortOpen(false)}
              className="mt-4 w-full py-2 text-center text-sm font-semibold text-gray-600 hover:text-gray-800 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}


      {/* MOBİL FİLTRE PANELİ*/}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-40 transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          ></div>

          {/* Filtre Paneli */}
          <div className="relative bg-white w-4/5 max-w-sm h-full shadow-lg transform translate-x-0 transition-transform duration-300 flex flex-col">

            {/* Başlık ve Kapat Butonu */}
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Filtrele</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-800"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              {/* Aktif Filtre Bilgisi */}
              {activeFilterCount > 0 && (
                <div className="mt-2 flex justify-between items-center text-sm">
                  <span className="text-orange-600 font-semibold">{activeFilterCount} Filtre Aktif</span>
                  <button onClick={clearFilters} className="text-red-500 hover:text-red-700 underline">
                    Temizle
                  </button>
                </div>
              )}
            </div>

            {/* Filtre İçeriği */}
            <div className="p-4 flex-grow overflow-y-auto">
              <ProductFilterSidebar
                allProducts={allProducts}
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
                priceRange={priceRange}
              />
            </div>

            {/* Uygula Butonu*/}
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                {products.length} Ürünü Göster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BannerPage;

