import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-toastify";
import { FaFilter } from "react-icons/fa";
import { getCategoryById, getSubCategoryById } from "../../services/categoryService";
import { getProductsByCategoryId, getProductsBySubCategoryId } from "../../services/productsService";

function CategoryProductsPage({ type = "category" }) {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [maxPrice, setMaxPrice] = useState(30000);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState("");

    // Kategori veya Subcategory bilgisi getir
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (type === "category") {
                    const data = await getCategoryById(id);
                    setCategoryData(data);
                    setSubcategories(data.subcategories || []);
                } else {
                    const data = await getSubCategoryById(id);
                    setCategoryData(data);
                    setSubcategories([]);
                }
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchData();
    }, [id, type]);

    // Ürünleri getir
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let data = [];
                if (type === "category") {
                    data = await getProductsByCategoryId(id);
                } else {
                    data = await getProductsBySubCategoryId(id);
                }
                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                toast.error("Ürünler alınamadı");
            }
        };
        fetchProducts();
    }, [id, type]);

    useEffect(() => {
        let result = [...products];
        if (selectedSubcategories.length > 0) {
            result = result.filter((product) =>
                selectedSubcategories.includes(product.subcategoryName)
            );
        }
        result = result.filter((product) => Number(product.price) <= maxPrice);
        setFilteredProducts(result);
    }, [selectedSubcategories, maxPrice, products]);

    useEffect(() => {
        let sorted = [...filteredProducts];

        switch (sortBy) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "oldest":
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "newest":
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "discount":
                sorted = sorted.filter((p) => p.discountPercentage > 0);
                break;
            default:
                break;
        }

        setFilteredProducts(sorted);
    }, [sortBy]);

    const toggleSubcategory = (subcategoryName) => {
        setSelectedSubcategories((prev) =>
            prev.includes(subcategoryName)
                ? prev.filter((name) => name !== subcategoryName)
                : [...prev, subcategoryName]
        );
    };

    const clearFilters = () => {
        setSelectedSubcategories([]);
        setMaxPrice(30000);
    };

    const removeFilter = (name) => {
        setSelectedSubcategories((prev) => prev.filter((item) => item !== name));
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-medium">
                5000 TL ve üzeri alışverişlerde ücretsiz kargo fırsatını kaçırmayın!
            </div>
            <div className="bg-blue-100 text-blue-900 text-center py-3 text-sm font-semibold">
                Yeni ürünler eklendi!
            </div>
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-md md:text-xl font-semibold text-gray-800 mb-2">
                    {categoryData?.name}
                </h1>
                <p className="text-sm text-gray-500">
                    Toplam {filteredProducts.length} ürün
                </p>
            </div>


            {/* Mobilde filtre ve sıralama butonları */}
            <div className="md:hidden px-6 mt-2 mb-8 flex gap-1">
                {/* Filtrele Butonu */}
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="bg-orange-400 text-white py-2 px-4 rounded-md font-semibold flex-1 flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center justify-center gap-2">
                        <span>Filtrele</span>
                        <FaFilter />
                    </div>
                    <span className="text-xs bg-white text-orange-600 px-2 py-0.5 rounded-full">
                        {selectedSubcategories.length + (maxPrice < 30000 ? 1 : 0)} aktif
                    </span>
                </button>

                {/* Sırala Butonu */}
                <button
                    onClick={() => setIsSortOpen(true)}
                    className="bg-orange-400 text-white py-2 px-4 rounded-md font-semibold flex-1 flex items-center justify-center gap-2 cursor-pointer"
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

            {isSortOpen && (
                <div className="fixed inset-0 z-50  bg-opacity-30 flex items-center justify-center md:hidden">
                    <div className="bg-white w-11/12 max-w-sm rounded-lg p-4 shadow-xl animate-fade-in">
                        <h3 className="text-lg font-semibold mb-4 text-center">Sırala</h3>
                        {[
                            { label: "Fiyat artan", value: "price-asc" },
                            { label: "Fiyat azalan", value: "price-desc" },
                            { label: "İlk Eklenen", value: "oldest" },
                            { label: "Son Eklenen", value: "newest" },
                            { label: "İndirimli", value: "discount" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setSortBy(option.value);
                                    setIsSortOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-md mb-2 transition ${sortBy === option.value
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-gray-100 text-gray-800 hover:bg-orange-50"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsSortOpen(false)}
                            className="mt-2 w-full text-center text-sm text-red-500 cursor-pointer"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}


            {/* Mobil Filtre Paneli */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-opacity-30 "
                        onClick={() => setIsFilterOpen(false)}
                    ></div>

                    <div className="relative bg-white w-4/5 max-w-sm h-full p-4 shadow-lg animate-slide-in-left z-50 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Filtrele</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className=" text-md font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="border-t border-gray-300 my-4 w-full"></div>

                        {(selectedSubcategories.length > 0 || maxPrice < 30000) && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-600">Uygulanan Filtreler:</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-red-500 underline"
                                    >
                                        Filtreleri Temizle
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    {selectedSubcategories.map((name) => (
                                        <span
                                            key={name}
                                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center"
                                        >
                                            {name}
                                            <button
                                                onClick={() => removeFilter(name)}
                                                className="ml-2 text-orange-500 hover:text-orange-700 font-bold"
                                                aria-label={`${name} filtresini kaldır`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    {maxPrice < 30000 && (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                                            Maks. {maxPrice.toLocaleString()} TL
                                            <button
                                                onClick={() => setMaxPrice(30000)}
                                                className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                                                aria-label="Fiyat filtresini kaldır"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3
                                onClick={() => setExpanded(!expanded)}
                                className="font-semibold mb-2 cursor-pointer"
                            >
                                Alt Kategoriler
                            </h3>
                            {expanded && subcategories.map((subcat) => (
                                <label key={subcat.id} className="block text-sm mb-1">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedSubcategories.includes(subcat.name)}
                                        onChange={() => toggleSubcategory(subcat.name)}
                                    />
                                    {subcat.name}
                                </label>
                            ))}
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Fiyat Aralığı</h3>
                            <input
                                type="range"
                                min={200}
                                max={30000}
                                step={100}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full accent-[var(--color-dark-orange)]"
                            />
                            <p className="text-sm mt-1">
                                Maksimum: {maxPrice.toLocaleString()} TL
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 flex pb-10 gap-6">
                <div className="w-1/4 bg-white p-6 rounded shadow-md hidden md:block">
                    <h2 className="text-lg font-semibold mb-4">Filtrele</h2>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Alt Kategoriler</h3>
                        {subcategories.map((subcat) => (
                            <label key={subcat.id} className="block text-sm mb-1">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedSubcategories.includes(subcat.name)}
                                    onChange={() => toggleSubcategory(subcat.name)}
                                />
                                {subcat.name}
                            </label>
                        ))}
                    </div>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Fiyat Aralığı</h3>
                        <input
                            type="range"
                            min={200}
                            max={30000}
                            step={100}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-sm mt-1">
                            Maksimum: {maxPrice.toLocaleString()} TL
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-3/4 flex flex-col gap-4">

                    <div className="hidden md:flex items-center justify-between pb-2">

                        <div className="flex items-center bg-gray-100 rounded overflow-hidden text-sm font-medium shadow-sm">
                            {[
                                { label: "Fiyat artan", value: "price-asc" },
                                { label: "Fiyat azalan", value: "price-desc" },
                                { label: "İndirim oranı artan", value: "discount" },
                                { label: "İlk eklenen", value: "oldest" },
                                { label: "Son eklenen", value: "newest" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value)}
                                    className={`px-8 py-3 transition-all duration-200
                            ${sortBy === option.value
                                            ? "bg-orange-400 text-white underline-offset-4"
                                            : "text-gray-700 hover:bg-orange-500 hover:text-white"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ürün grid'i */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500">
                                Ürün bulunamadı.
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
