import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


function CategorySubcategoryFilter({ allProducts, filters, setFilters, clearFilters, priceRange, isMobile = false }) {
    
    // --- State: Açılır Kapanır Paneller ---
    const [openPanels, setOpenPanels] = useState({
        subcategories: true,
        brands: true,
        price: true,
        rating: true,
    });

    const togglePanel = (panel) => {
        setOpenPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
    };

    // --- Filtre Seçeneklerini Hesaplama (Alt Kategori, Marka) ---
    const filterOptions = useMemo(() => {
        const subcategoryCounts = {};
        const brandCounts = {};
        const uniqueSubcategories = new Set();
        const uniqueBrands = new Set();

        allProducts.forEach(product => {
            // ALT KATEGORİLERİ TOPLA (product.subcategoryName kullandığınızı varsayarak)
            if (product.subcategoryName) {
                const subName = product.subcategoryName;
                uniqueSubcategories.add(subName);
                subcategoryCounts[subName] = (subcategoryCounts[subName] || 0) + 1;
            }

            // MARKALARI TOPLA
            if (product.brand) {
                const brandName = product.brand;
                uniqueBrands.add(brandName);
                brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
            }
        });

        const sortedSubcategories = Array.from(uniqueSubcategories)
            .sort((a, b) => subcategoryCounts[b] - subcategoryCounts[a]); // Çoktan aza sırala

        const sortedBrands = Array.from(uniqueBrands)
            .sort((a, b) => brandCounts[b] - brandCounts[a]);

        return {
            subcategories: sortedSubcategories.map(name => ({ name, count: subcategoryCounts[name] })),
            brands: sortedBrands.map(name => ({ name, count: brandCounts[name] })),
        };
    }, [allProducts]);

    // --- Alt Kategori Filtreleme Fonksiyonu ---
    const handleSubcategoryChange = (subName) => {
        setFilters(prev => {
            const current = prev.subcategories;
            if (current.includes(subName)) {
                return { ...prev, subcategories: current.filter(n => n !== subName) };
            } else {
                return { ...prev, subcategories: [...current, subName] };
            }
        });
    };
    
    // --- Marka Filtreleme Fonksiyonu ---
    const handleBrandChange = (brandName) => {
        setFilters(prev => {
            const current = prev.brands;
            if (current.includes(brandName)) {
                return { ...prev, brands: current.filter(n => n !== brandName) };
            } else {
                return { ...prev, brands: [...current, brandName] };
            }
        });
    };

    // --- Rating Filtreleme Fonksiyonu ---
    const handleRatingChange = (rating) => {
        setFilters(prev => ({ ...prev, minRating: rating }));
    };

    // --- Ortak Panel Yapısı ---
    const FilterPanel = ({ title, children, panelKey }) => (
        <div className={`border-b ${isMobile ? 'py-3' : 'pb-4'}`}>
            <div
                className="flex justify-between items-center cursor-pointer py-2 hover:text-orange-600 transition"
                onClick={() => togglePanel(panelKey)}
            >
                <h3 className="text-md font-semibold text-gray-800">{title}</h3>
                {openPanels[panelKey] ? <FaChevronUp className="w-4 h-4 text-gray-500" /> : <FaChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
            {openPanels[panelKey] && (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pr-2">
                    {children}
                </div>
            )}
        </div>
    );
    
    return (
        <div className="space-y-4">
            {/* Filtreleri Temizle Butonu */}
            <button 
                onClick={clearFilters}
                className="w-full py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition font-medium"
            >
                Tüm Filtreleri Temizle
            </button>
            
            {/* Alt Kategoriler Filtresi */}
            {subcategories.length > 0 && (
                <FilterPanel title="Alt Kategoriler" panelKey="subcategories">
                    {subcategories.map(sub => (
                        <label key={sub.name} className="flex items-center justify-between text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition">
                            <input
                                type="checkbox"
                                className="form-checkbox text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                                checked={filters.subcategories.includes(sub.name)}
                                onChange={() => handleSubcategoryChange(sub.name)}
                            />
                            <span className="flex-1 ml-3">{sub.name}</span>
                            <span className="text-xs text-gray-500">({sub.count})</span>
                        </label>
                    ))}
                </FilterPanel>
            )}

            {/* Fiyat Filtresi */}
            <FilterPanel title="Fiyat Aralığı" panelKey="price">
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
            </FilterPanel>

            {/* Marka Filtresi */}
            {filterOptions.brands.length > 0 && (
                <FilterPanel title="Markalar" panelKey="brands">
                    {filterOptions.brands.map(brand => (
                        <label key={brand.name} className="flex items-center justify-between text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition">
                            <input
                                type="checkbox"
                                className="form-checkbox text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                                checked={filters.brands.includes(brand.name)}
                                onChange={() => handleBrandChange(brand.name)}
                            />
                            <span className="flex-1 ml-3">{brand.name}</span>
                            <span className="text-xs text-gray-500">({brand.count})</span>
                        </label>
                    ))}
                </FilterPanel>
            )}

            {/* Puan (Rating) Filtresi */}
            <FilterPanel title="Müşteri Puanı" panelKey="rating">
                {[5, 4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition">
                        <input
                            type="radio"
                            name="minRating"
                            className="form-radio text-orange-500 border-gray-300 focus:ring-orange-500"
                            checked={filters.minRating === rating}
                            onChange={() => handleRatingChange(rating)}
                        />
                        <span className="ml-3 flex items-center">
                            {Array(5).fill().map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.042a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.042a1 1 0 00-1.175 0l-2.817 2.042c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.022 8.721c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="ml-2"> ve üzeri</span>
                        </span>
                    </label>
                ))}
            </FilterPanel>
        </div>
    );
}

export default CategorySubcategoryFilter;