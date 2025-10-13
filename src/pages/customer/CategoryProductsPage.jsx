import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import ProductFilterSidebar from "../../components/ProductFilterSidebar";
import { toast } from "react-toastify";
import { FaFilter, FaTimes } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { generateCategoryUrl } from "../../utils/urlHelpers";
import { getCategoryById, getSubCategoryById } from "../../services/categoryService";
import { getProductsByCategoryId, getProductsBySubCategoryId } from "../../services/productsService";
import useProductFiltering from "../../hooks/useProductFiltering";

function CategoryProductsPage({ type = "category" }) {
    const { id, categorySlug, subcategorySlug } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // --- URL Analizi ---
    let actualId = id;
    let pageType = type;

    if (categorySlug && subcategorySlug) {
        const match = subcategorySlug.match(/-x-g(\d+)$/);
        actualId = match ? parseInt(match[1], 10) : subcategorySlug;
        pageType = "subcategory";
    } else if (categorySlug && !id) {
        const match = categorySlug.match(/-x-g(\d+)$/);
        actualId = match ? parseInt(match[1], 10) : categorySlug;
        pageType = "category";
    }

    // --- Kategori veya Alt Kategori Verisi ---
    useEffect(() => {
        const fetchData = async () => {
            if (!actualId) return;

            try {
                let data = null;
                if (pageType === "category") {
                    data = await getCategoryById(actualId);
                } else {
                    data = await getSubCategoryById(actualId);
                    if (data?.categoryId) {
                        const parentCategory = await getCategoryById(data.categoryId);
                        data.parentCategory = parentCategory;
                    }
                }

                if (!data || Object.keys(data).length === 0) {
                    navigate("/sayfa-bulunamadi", { replace: true });
                    return;
                }
                setCategoryData(data);
            } catch {
                navigate("/sayfa-bulunamadi", { replace: true });
            }
        };
        fetchData();
    }, [actualId, pageType, navigate]);

    // --- Ürünleri Çek ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let data = [];
                if (pageType === "category") {
                    data = await getProductsByCategoryId(actualId);
                } else {
                    data = await getProductsBySubCategoryId(actualId);
                }
                setProducts(data);
            } catch {
                toast.error("Ürünler alınamadı");
            }
        };
        fetchProducts();
    }, [actualId, pageType]);

    // --- Min/Max Fiyat Aralığı Hesaplama ---
    const priceRange = useMemo(() => {
        if (products.length === 0) return { min: 0, max: 100000 };
        const prices = products.map((p) => Number(p.price) || 0);
        return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
    }, [products]);

    //  useProductFiltering Hook Kullanımı
    const {
        products: filteredProducts,
        filters,
        setFilters,
        sortOption,
        setSortOption,
        activeFilterCount,
        clearFilters,
    } = useProductFiltering(products, priceRange);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Duyuru Alanları */}
            <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-medium">
                5000 TL ve üzeri alışverişlerde ücretsiz kargo fırsatını kaçırmayın!
            </div>
            <div className="bg-blue-100 text-blue-900 text-center py-3 text-sm font-semibold">
                Yeni ürünler eklendi!
            </div>

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 py-3">
                <nav className="flex items-center flex-wrap text-sm lg:text-base">
                    <Link to="/" className="hover:text-orange-600 text-gray-700">Sanayice</Link>

                    {pageType === "subcategory" && categoryData?.parentCategory && (
                        <>
                            <span className="mx-2"><SlArrowRight className="text-orange-600" /></span>
                            <Link
                                to={generateCategoryUrl(categoryData.parentCategory)}
                                className="hover:text-orange-600 text-gray-700"
                            >
                                {categoryData.parentCategory.name}
                            </Link>
                        </>
                    )}

                    {categoryData && (
                        <>
                            <span className="mx-2"><SlArrowRight className="text-orange-600" /></span>
                            <span className="text-gray-900 font-semibold">{categoryData.name}</span>
                        </>
                    )}
                </nav>
            </div>

            {/* --- MOBİL: Filtre ve Sıralama Butonları --- */}
            <div className="md:hidden px-4 mt-2 flex gap-1">
                {/* Filtrele Butonu */}
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="bg-orange-500 text-white py-2 px-4 rounded-md font-semibold flex-1 flex items-center justify-between hover:bg-orange-600"
                >
                    <div className="flex items-center gap-2">
                        <span>Filtrele</span>
                        <FaFilter />
                    </div>
                    <span className="text-xs bg-white text-orange-600 px-2 py-0.5 rounded-full">
                        {activeFilterCount} aktif
                    </span>
                </button>

                {/* Sırala Butonu */}
                <button
                    onClick={() => setIsSortOpen(true)}
                    className="bg-gray-50 text-orange-600 py-2 px-4 rounded-md font-semibold flex-1 flex items-center justify-center gap-2 border border-gray-300 transition hover:bg-gray-200"
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

            {/** Mobilde sıralama paneli */}
            {isSortOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-40 flex items-center justify-center lg:hidden transition-opacity duration-300">
                    <div className="bg-white w-full rounded-t-xl p-4 shadow-xl max-w-sm transform translate-y-0 transition-transform duration-300">
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

            {/* --- MOBİL FİLTRE PANELİ --- */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden justify-end">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsFilterOpen(false)}
                    ></div>

                    <div className="relative bg-white w-4/5 max-w-sm h-full shadow-lg flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Filtrele</h2>
                            <button onClick={() => setIsFilterOpen(false)}><FaTimes size={20} /></button>
                        </div>
                        {/* Aktif Filtre Bilgisi ve Temizle Butonu */}
                        {activeFilterCount > 0 && (
                            <div className="px-4 pt-2 flex justify-between items-center text-sm">
                                <span className="text-orange-600 font-semibold">{activeFilterCount} Filtre Aktif</span>
                                <button onClick={clearFilters} className="text-red-500 hover:text-red-700 underline">
                                    Temizle
                                </button>
                            </div>
                        )}

                        <div className="p-4 flex-grow overflow-y-auto">
                            <ProductFilterSidebar
                                allProducts={products}
                                filters={filters}
                                setFilters={setFilters}
                                clearFilters={clearFilters}
                                priceRange={priceRange}
                            />
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                            >
                                {filteredProducts.length} Ürünü Göster
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ANA İÇERİK --- */}
            <main className="max-w-7xl mx-auto px-4 py-8 flex pb-10 gap-6">
                {/* Sidebar (Desktop) */}
                <div className="w-1/4 hidden md:block">
                    <ProductFilterSidebar
                        allProducts={products}
                        products={filteredProducts}
                        filters={filters}
                        setFilters={setFilters}
                        clearFilters={clearFilters}
                        priceRange={priceRange}
                    />
                </div>

                {/* Ürün Listesi */}
                <div className="w-full md:w-3/4 flex flex-col gap-4">
                    {/* Üst Başlık ve Sıralama */}
                    <div className="hidden lg:flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-md border-t-4 border-orange-500">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-xl font-bold text-gray-800">{categoryData?.name || "Kategori Adı"}</h1>
                            <p className="text-sm text-gray-500">(Toplam {filteredProducts.length} ürün)</p>
                        </div>

                        <select
                            className="border outline-none border-gray-300 rounded-lg p-2 text-sm focus:ring-orange-500"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="recommended">Önerilen</option>
                            <option value="lowPrice">Fiyat: Düşükten Yükseğe</option>
                            <option value="highPrice">Fiyat: Yüksekten Düşüğe</option>
                            <option value="bestSeller">Çok Satanlar</option>
                        </select>
                    </div>

                    {/* Ürün Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-md">
                                <p className="text-xl font-semibold text-gray-700">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                                <p className="text-gray-500 mt-2">Filtreleri temizlemeyi veya değiştirmeyi deneyin.</p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
export default CategoryProductsPage;
