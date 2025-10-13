import { useState, useEffect, useMemo, useCallback } from "react";

//filtre durumu
const initialFilters = {
    categories: [],
    brands: [],
    minPrice: "", // İlk fetch'ten sonra doldurulacak
    maxPrice: "", // İlk fetch'ten sonra doldurulacak
    subcategories: [],
    minRating: 0,
};
const useProductFiltering = (allProducts, priceRange) => {
    const [filters, setFilters] = useState(initialFilters);
    const [sortOption, setSortOption] = useState("recommended");

    useEffect(() => {
        if (allProducts.length > 0 && priceRange.max > 0) {
             setFilters((prev) => ({ 
                ...prev, 
                minPrice: priceRange.min, 
                maxPrice: priceRange.max 
            }));
        }
    }, [allProducts, priceRange]);


    // Filtreleme ve Sıralama İşlemi
    const products = useMemo(() => {
        let filtered = [...allProducts];

        // Kategori Filtresi
        if (filters.categories.length > 0) {
            filtered = filtered.filter((p) =>
                filters.categories.includes(p.categoryName)
            );
        }

        // Alt Kategori Filtresi
        if (filters.subcategories.length > 0) {
            filtered = filtered.filter((p) =>
                filters.subcategories.includes(p.subcategoryName)
            );
        }

        // Marka Filtresi
        if (filters.brands.length > 0) {
            filtered = filtered.filter((p) => filters.brands.includes(p.brand));
        }

        // Fiyat Filtresi
        const minP = Number(filters.minPrice);
        const maxP = Number(filters.maxPrice);
        
        // Varsayılan fiyat aralığından sapma varsa filtrele
        if (minP > priceRange.min && maxP <= priceRange.max) {
             filtered = filtered.filter((p) => p.price >= minP);
        }
        if (maxP < priceRange.max && minP >= priceRange.min) {
            filtered = filtered.filter((p) => p.price <= maxP);
        }

        // Değerlendirme Filtresi
        if (filters.minRating > 0) {
            filtered = filtered.filter((p) => (p.rating || 0) >= filters.minRating);
        }

        // --- SIRALAMA ---
        switch (sortOption) {
            case "bestSeller":
                // Satış adedine göre büyükten küçüğe
                filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
                break;
            case "highPrice":
                // Fiyata göre büyükten küçüğe
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "lowPrice":
                // Fiyata göre küçükten büyüğe
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "recommended":
            default:
                break;
        }
        return filtered;
    }, [allProducts, filters, sortOption, priceRange]);


    // Aktif Filtre Sayısını Hesaplama
    const activeFilterCount = useMemo(() => {
        let count = filters.categories.length + filters.brands.length + filters.subcategories.length;
        
        // Fiyat filtreleri varsayılan değerden farklıysa say
        if (Number(filters.minPrice) > priceRange.min) {
            count++;
        }
        if (Number(filters.maxPrice) < priceRange.max) {
            count++;
        }
        
        if (filters.minRating > 0) {
            count++;
        }
        return count;
    }, [filters, priceRange]);

    // Filtreleri Temizleme 
    const clearFilters = useCallback(() => {
        setFilters({
            categories: [],
            brands: [],
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            subcategories: [],
            minRating: 0,
        });
    }, [priceRange.min, priceRange.max]); // priceRange değişirse bu fonksiyonun yeniden oluşturulmasını sağlar.

    return {
        products,
        filters,
        setFilters,
        sortOption,
        setSortOption,
        activeFilterCount,
        clearFilters,
    };
};

export default useProductFiltering;