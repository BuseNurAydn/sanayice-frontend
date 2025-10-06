import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { getActiveProductsBySeller } from "../../services/productsService";
import SellerReviews from "./SellerReviews";
import { followSeller, isFollowingSeller, unfollowSeller } from "../../services/authService";
import { toast } from "react-toastify";

const SellerPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sellerInfo, setSellerInfo] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("allProducts");
    const [loading, setLoading] = useState(true);

    // Filtreleme State'leri
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [minRating, setMinRating] = useState(0);

    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const responseData = await getActiveProductsBySeller(id);
                
                // Satıcı bilgileri responseData.sellerInfo
                const info = responseData.sellerInfo || null;
                setSellerInfo(info);
                
                // Ürünler responseData.products'tan
                const safeProducts = Array.isArray(responseData.products) ? responseData.products : [];
                setProducts(safeProducts);
                setFilteredProducts(safeProducts);
                
                // Takip durumunu kontrol et
                if (info && info.sellerId) {
                    const followingStatus = await isFollowingSeller(info.sellerId);
                    setIsFollowing(followingStatus);
                }

                console.log("API Yanıtı - Ürünler:", safeProducts);
                console.log("API Yanıtı - Satıcı Bilgisi:", info);

            } catch (err) {
                console.error("Veri alınamadı:", err);
                setFilteredProducts([]);
                setSellerInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Takip Et/Takipten Çıkma
    const handleFollowSeller = async (sellerId) => {
        if (!sellerId) return toast.error("Satıcı bilgisi bulunamadı!");

        try {
            if (isFollowing) {
                await unfollowSeller(sellerId);
                setIsFollowing(false);
                setSellerInfo(prev => ({
                    ...prev,
                    followerCount: (prev?.followerCount || 1) - 1 
                }));
                toast.info("Satıcı takipten çıkarıldı");
            } else {
                await followSeller(sellerId);
                setIsFollowing(true);
                setSellerInfo(prev => ({
                    ...prev,
                    followerCount: (prev?.followerCount || 0) + 1
                }));
                toast.success("Satıcı takip edildi");
            }
        } catch (err) {
            toast.error(err.message || "Takip işlemi sırasında hata oluştu");
        }
    };

    // FİLTRELEME
    useEffect(() => {
        const productList = Array.isArray(products) ? products : [];
        let result = [...productList]; 

        if (selectedCategory.length > 0) {
            result = result.filter(p => selectedCategory.includes(p.categoryName));
        }

        result = result.filter(
            // Rating alanı yoksa 0 kabul et
            (p) => Number(p.price) <= maxPrice && (p.rating ?? 0) >= minRating
        );

        setFilteredProducts(result);
    }, [selectedCategory, maxPrice, minRating, products]);


    const tabs = [
        { key: "allProducts", label: "Tüm ürünler" },
        { key: "profile", label: "Satıcı profili" },
        { key: "rate", label: "Satıcı Değerlendirmeleri" }
    ];

    if (loading) return <p className="text-center py-20">Yükleniyor...</p>;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Breadcrumb */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
                    <nav className="text-sm text-gray-600">
                        <Link to="/" className="hover:text-orange-600 cursor-pointer text-sm">Ana Sayfa</Link>
                        <span className="mx-2">/</span>
                        <Link className="hover:text-orange-600 cursor-pointer text-xs">Mağaza</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium text-sm">
                            {sellerInfo?.companyName || "Satıcı"}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Banner */}
            <div className="relative w-full h-40 md:h-48 bg-cover bg-center">
                <div className="absolute inset-0 bg-[var(--color-dark-blue)] bg-opacity-40"></div>
            </div>

            {/* Profil Bilgileri */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                {sellerInfo ? (
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-12 sm:-mt-10">
                        <img
                            src={sellerInfo.profileImageUrl || 'default-avatar-url'}
                            alt={sellerInfo.sellerName}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md"
                        />
                        <div className="flex-1 text-gray-900 text-center sm:text-left gap-6 mt-4 md:mt-10">
                            <h1 className="text-xl md:text-2xl font-bold">{sellerInfo.companyName}</h1>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-sm text-gray-600">
                                <span className="bg-[var(--color-dark-orange)] text-white px-3 py-1 rounded-full font-semibold text-sm">{sellerInfo.averageRating || '—'}</span>
                                <span>{sellerInfo.followerCount || 0} takipçi</span>
                                <span>{products.length} ürün</span>
                                <span>{sellerInfo.ratingCount || 0} değerlendirme</span>
                            </div>
                        </div>
                        <div className="md:mt-12 mt-4">
                            <button
                                onClick={() => handleFollowSeller(sellerInfo.sellerId || id)}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md w-full sm:w-auto cursor-pointer hover:bg-orange-600"
                            >
                                {isFollowing ? "Takip Ediliyor" : "Takip Et"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="-mt-12 sm:-mt-10 text-center sm:text-left py-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Satıcı Bilgileri Yükleniyor/Bulunamadı</h1>
                    </div>
                )}
            </div>

            {/* Sekmeler */}
            <div className="border-b border-gray-200 bg-white font-semibold mt-8">
                <div className="max-w-7xl mx-auto flex gap-8 px-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-6 px-2 -mb-px border-b-2 ${activeTab === tab.key
                                ? "border-[var(--color-orange)] text-[var(--color-orange)]"
                                : "border-transparent text-gray-600"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* İçerik */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {activeTab === "allProducts" && (
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sol filtreleme */}
                        <div className="flex flex-col gap-4 w-full md:w-1/4 bg-white p-6 rounded shadow-md">
                            <h2 className="text-lg font-semibold mb-4">Filtrele</h2>

                            {/* Kategoriler */}
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Kategoriler</h3>
                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                    {/* products'ın dizi olduğundan emin olundu */}
                                    {[...new Set(Array.isArray(products) ? products.map(p => p.categoryName) : [])].map((cat) => (
                                        <label key={cat} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategory.includes(cat)}
                                                onChange={() => {
                                                    if (selectedCategory.includes(cat)) {
                                                        setSelectedCategory(selectedCategory.filter(c => c !== cat));
                                                    } else {
                                                        setSelectedCategory([...selectedCategory, cat]);
                                                    }
                                                }}
                                            />
                                            <span className="text-gray-700">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Fiyat */}
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Fiyat Aralığı</h3>
                                <input
                                    type="range"
                                    min={0}
                                    max={100000}
                                    step={100}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full"
                                />
                                <p className="text-sm mt-1">Maksimum: {maxPrice.toLocaleString()} TL</p>
                            </div>

                            {/* Değerlendirme */}
                            <div>
                                <h3 className="font-semibold mb-2">Değerlendirme</h3>
                                {[4.5, 4, 2].map(r => (
                                    <label key={r} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={minRating === r}
                                            onChange={() => setMinRating(minRating === r ? 0 : r)}
                                        />
                                        <span className="flex items-center gap-1">
                                            <span className="text-yellow-400">
                                                {"★".repeat(Math.floor(r))}{"☆".repeat(5 - Math.floor(r))}
                                            </span>
                                            <span className="text-gray-700 text-sm">{r} ve üzeri</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sağ ürünler */}
                        <div className="flex-1">
                            {filteredProducts.length === 0 && products.length > 0 ? (
                                <p className="text-gray-500">Seçili filtrelere uygun ürün bulunamadı.</p>
                            ) : filteredProducts.length === 0 && products.length === 0 ? (
                                <p className="text-gray-500">Bu satıcının aktif bir ürünü bulunmamaktadır.</p>
                            ) : (
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "profile"  && sellerInfo && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Gönderim adresi", value: sellerInfo?.shippingAddress },
                                { label: "Ortalama kargolama süresi", value: sellerInfo?.shippingDays },
                                { label: "Soru cevaplama süresi", value: sellerInfo?.responseTime },
                                { label: "Platformdaki süresi", value: sellerInfo?.memberSince },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-lg shadow p-4 text-center"
                                >
                                    <p className="font-bold">{item.value || "—"}</p>
                                    <p className="text-gray-500 text-sm">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Satıcı Bilgileri */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-bold mb-6 text-[var(--color-orange)]">
                                Satıcı Bilgileri
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <p><strong>Yetkili Kişi:</strong> {sellerInfo?.sellerName || "—"}</p>
                                <p><strong>Telefon Numarası:</strong> {sellerInfo?.phoneNumber || "—"}</p>
                                <p><strong>Kayıtlı E-Posta:</strong> {sellerInfo?.email || "—"}</p>
                                {/* Not: Mersis No, Adres ve Vergi No gibi alanların sellerInfo objenizde olduğundan emin olun */}
                                <p><strong>Mersis No:</strong> {sellerInfo?.mersisNo || "—"}</p>
                                <p><strong>Merkez Adresi:</strong> {sellerInfo?.address || "—"}</p>
                                <p><strong>Vergi No:</strong> {sellerInfo?.taxId || "—"}</p>
                            </div>
                        </div>
                    </>
                )}
                
                {activeTab === "profile" && !sellerInfo && (
                    <p className="text-gray-500">Satıcı profili bilgileri bulunamadı.</p>
                )}


                {activeTab === "rate" && <SellerReviews sellerId={id} />}
            </div>
        </div>
    );
};

export default SellerPage;