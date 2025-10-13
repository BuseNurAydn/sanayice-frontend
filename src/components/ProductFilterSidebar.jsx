import  { useMemo, useState } from 'react';

const FilterSection = ({ title, children }) => (
    <div className="border-b border-gray-200 py-3">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        <div className="mt-2 text-sm space-y-1 lg:max-h-60 lg:overflow-y-auto"> 
            {children}
        </div>
    </div>
);

const ProductFilterSidebar = ({
    allProducts,    
    products,       
    filters,
    setFilters,
    clearFilters,
    priceRange,     
    
}) => {

    const [showAllOptions, setShowAllOptions] = useState(false);
    
    // FİLTRE SEÇENEKLERİNİN HESAPLANMASI
    const mainCategories = useMemo(() => {
        const counts = {};
        allProducts.forEach((p) => {
            if (p.categoryName) {
                counts[p.categoryName] = (counts[p.categoryName] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .map(([categoryName, count]) => ({ name: categoryName, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allProducts]);

    const subcategories = useMemo(() => {
        const counts = {};
        allProducts.forEach((p) => {
            if (p.subcategoryName) {
                counts[p.subcategoryName] = (counts[p.subcategoryName] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .map(([subcategoryName, count]) => ({ subcategoryName, count }))
            .sort((a, b) => a.subcategoryName.localeCompare(b.subcategoryName));
    }, [allProducts]);

    const brands = useMemo(() => {
        const counts = {};
        allProducts.forEach((p) => {
            if (p.brand) {
                counts[p.brand] = (counts[p.brand] || 0) + 1;
            }
        });
        return Object.entries(counts).map(([brand, count]) => ({ brand, count }));
    }, [allProducts]);

    const handleCheckboxChange = (filterKey, value, isChecked) => {
        setFilters((prev) => {
            const currentArray = prev[filterKey] || [];
            const newArray = isChecked
                ? [...currentArray, value]
                : currentArray.filter((x) => x !== value);
            return { ...prev, [filterKey]: newArray };
        });
    };

    const handlePriceChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // FİLTRE İÇERİKLERİNİ DÖNDÜREN YARDIMCI BİLEŞEN
    const FilterContent = () => (
        <>
            {/* Ana Kategoriler Filtresi */}
            {mainCategories.length > 0 && (
                <FilterSection title="Kategoriler">
                    {mainCategories
                        .slice(0, showAllOptions ? mainCategories.length : 5)
                        .map(({ name, count }) => (
                            <label key={name} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(name)}
                                    onChange={(e) => handleCheckboxChange("categories", name, e.target.checked)}
                                />
                                <span className="text-gray-700">
                                    {name} <span className="text-gray-400">({count})</span>
                                </span>
                            </label>
                        ))}
                    {mainCategories.length > 5 && (
                        <button
                            onClick={() => setShowAllOptions((prev) => !prev)}
                            className="text-orange-500 text-sm mt-2"
                        >
                            {showAllOptions ? "Daha Az Göster" : "Daha Fazla Göster"}
                        </button>
                    )}
                </FilterSection>
            )}

            {/* Alt Kategoriler Filtresi */}
            {subcategories.length > 0 && (
                <FilterSection title="Alt Kategoriler">
                    {subcategories
                        .slice(0, showAllOptions ? subcategories.length : 5)
                        .map(({ subcategoryName, count }) => (
                            <label key={subcategoryName} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.subcategories.includes(subcategoryName)}
                                    onChange={(e) => handleCheckboxChange("subcategories", subcategoryName, e.target.checked)}
                                />
                                <span className="text-gray-700">
                                    {subcategoryName} <span className="text-gray-400">({count})</span>
                                </span>
                            </label>
                        ))}
                </FilterSection>
            )}
            
            {/* Marka Filtresi */}
            <FilterSection title="Marka">
                {brands
                    .slice(0, showAllOptions ? brands.length : 5)
                    .map(({ brand, count }) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={(e) => handleCheckboxChange("brands", brand, e.target.checked)}
                            />
                            <span className="text-gray-700">
                                {brand} <span className="text-gray-400">({count})</span>
                            </span>
                        </label>
                    ))}
                    
                {brands.length > 5 && (
                    <button
                        onClick={() => setShowAllOptions((prev) => !prev)}
                        className="text-orange-500 text-sm mt-2"
                    >
                        {showAllOptions ? "Daha Az Göster" : "Daha Fazla Göster"}
                    </button>
                )}
            </FilterSection>

            {/* Fiyat Aralığı Filtresi */}
            <FilterSection title="Fiyat Aralığı">
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="number"
                        value={filters.minPrice}
                        min={priceRange.min}
                        max={filters.maxPrice || priceRange.max}
                        onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                        className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Min"
                    />
                    <input
                        type="number"
                        value={filters.maxPrice}
                        min={filters.minPrice || priceRange.min}
                        max={priceRange.max}
                        onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
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
                    onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500"
                />
                <p className="text-sm mt-1">
                    {Number(filters.minPrice).toLocaleString()} TL - {Number(filters.maxPrice).toLocaleString()} TL
                </p>
            </FilterSection>

            {/* Değerlendirme Filtresi */}
            <FilterSection title="Değerlendirme">
                {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            checked={filters.minRating === rating}
                            onChange={() => handlePriceChange("minRating", rating)}
                        />
                        <span className="text-gray-700 flex items-center">
                            {`${rating} Yıldız ve Üzeri`}
                            <span className="text-yellow-500 ml-1">{'⭐'.repeat(rating)}</span>
                        </span>
                    </label>
                ))}
            </FilterSection>
        </>
    )

    return (
        <>
            {/*  MASAÜSTÜ SİDEBARI */}
            <div className="hidden lg:block sticky top-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Filtrele</h2>
  
                <FilterContent />

                <button
                    onClick={clearFilters}
                    className="mt-4 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                    Filtreleri Temizle
                </button>
            </div>
            
            {/* DiscoverPage'de çağrıldığında, mobil için sadece FilterContent() dönecek.*/}
            <div className="lg:hidden">
                 <FilterContent />
            </div>
        </>
    );
};

export default ProductFilterSidebar;