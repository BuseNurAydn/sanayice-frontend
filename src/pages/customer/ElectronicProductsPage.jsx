import { useState } from 'react';
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard';
const allProducts = [
    {
        id: 1,
        name: 'Laptop',
        brand: 'Lenovo',
        category: 'Bilgisayar',
        price: 15000,
        image: 'https://productimages.hepsiburada.net/s/777/222-222/110000665188822.jpg/format:webp',
    },
    {
        id: 2,
        name: 'Telefon',
        brand: 'Samsung',
        category: 'Telefon',
        price: 12000,
        image: 'https://productimages.hepsiburada.net/s/777/222-222/110000787442617.jpg/format:webp',
    },
    {
        id: 3,
        name: 'Tablet',
        brand: 'Apple',
        category: 'Tablet',
        price: 20000,
        image: 'https://productimages.hepsiburada.net/s/777/222-222/110000685748947.jpg/format:webp',
    },
    {
        id: 4,
        name: 'Gaming Laptop',
        brand: 'Monster',
        category: 'Bilgisayar',
        price: 25000,
        image: 'https://productimages.hepsiburada.net/s/777/222-222/110000664868345.jpg/format:webp',
    }
];

function ElectronicPage() {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [maxPrice, setMaxPrice] = useState(30000);

    const brands = ['Lenovo', 'Samsung', 'Apple', 'Monster'];
    const categories = ['Bilgisayar', 'Telefon', 'Tablet'];

    const toggleBrand = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const filteredProducts = allProducts.filter((product) => {
        const brandMatch =
            selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const categoryMatch =
            selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price <= maxPrice;

        return brandMatch && categoryMatch && priceMatch;
    });

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
           
            <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-medium">
                 5000 TL ve üzeri alışverişlerde ücretsiz kargo fırsatını kaçırmayın!
            </div>
            <div className="bg-blue-100 text-blue-900 text-center py-3 text-sm font-semibold">
                Yeni ürünler eklendi! <Link to="#" className="underline">Hemen incele</Link>
            </div>

            <main className="max-w-7xl mx-auto px-6 flex py-10 gap-6">
                {/* Sol Panel: Filtre */}
                <div className="w-1/4 bg-white p-6 rounded shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Filtrele</h2>

                    {/* Alt Kategori */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Alt Kategoriler</h3>
                        {categories.map((cat) => (
                            <label key={cat} className="block text-sm mb-1">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>

                    {/* Marka */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Markalar</h3>
                        {brands.map((brand) => (
                            <label key={brand} className="block text-sm mb-1">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>

                    {/* Fiyat */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Fiyat Aralığı</h3>
                        <input
                            type="range"
                            min={5000}
                            max={30000}
                            step={1000}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-sm mt-1">Maksimum: {maxPrice.toLocaleString()} TL</p>
                    </div>
                </div>

                {/* Sağ Panel: Ürünler */}
                <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">Ürün bulunamadı.</div>
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

export default ElectronicPage;
