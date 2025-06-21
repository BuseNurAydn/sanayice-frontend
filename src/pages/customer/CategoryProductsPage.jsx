import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-toastify";
import { getCategoryById } from "../../services/categoryService";
import { getProductsByCategoryId } from "../../services/productsService";

function CategoryProductsPage() {
    const { id } = useParams(); // kategori ID
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [maxPrice, setMaxPrice] = useState(30000);

    //Tıklanan kategorinin id'sine göre kategori verisini çektim. Alt kategorilerde zaten geliyor
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await getCategoryById(id);
                setCategoryData(data);
                setSubcategories(data.subcategories || []);
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchCategory();
    }, [id]);

    // Ürünleri kategoriye göre çektim
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsByCategoryId(id);
                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                toast.error(err.message);
            }
        };
        fetchProducts();
    }, [id]);

    useEffect(() => {
        let result = [...products];

        // Alt kategori filtresi
        if (selectedSubcategories.length > 0) {
            result = result.filter((product) =>
                selectedSubcategories.includes(product.subcategoryName)
            );
        }

        // Fiyat filtresi
        result = result.filter((product) => Number(product.price) <= maxPrice);

        setFilteredProducts(result);
    }, [selectedSubcategories, maxPrice, products]);


    const toggleSubcategory = (subcategoryName) => {
        setSelectedSubcategories((prev) =>
            prev.includes(subcategoryName)
                ? prev.filter((name) => name !== subcategoryName)
                : [...prev, subcategoryName]
        );
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-medium">
                5000 TL ve üzeri alışverişlerde ücretsiz kargo fırsatını kaçırmayın!
            </div>
            <div className="bg-blue-100 text-blue-900 text-center py-3 text-sm font-semibold">
                Yeni ürünler eklendi!
            </div>

            <main className="max-w-7xl mx-auto px-6 flex py-10 gap-6">
                {/* Sol Panel: Filtre */}
                <div className="w-1/4 bg-white p-6 rounded shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Filtrele</h2>

                    {/* Alt Kategori */}
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

                    {/* Fiyat Aralığı */}
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

                {/* Sağ Panel: Ürünler */}
                <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </main>
        </div>
    );
}
export default CategoryProductsPage;
