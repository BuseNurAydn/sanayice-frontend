import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch, FaFileExcel, FaFilter, FaPlus } from "react-icons/fa";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { fetchMyProducts, deleteProduct } from "../../../services/sellerProductService";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // Excel için
import AdminText from "../../../shared/Text/AdminText";
import AddButton from "../../../shared/Button/AddButton";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ modelNumber: "", name: "", brand: "", categoryName: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ürünleri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyProducts();
        setProducts(data);
        console.log(data)
      } catch (error) {
        toast.error("Ürünler alınamadı");
      }
    };
    fetchData();
  }, []);

  // Ürün silme işlemi
  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      setProducts(products.filter((p) => p.id !== selectedProductId));
      toast.success("Ürün başarıyla silindi");
    } catch (error) {
      if (error.message === "Ürün silinemedi") {
        toast.error("Bu ürün şu anda bir müşteri tarafından kullanılıyor. Şu an silinemez.");
      } else {
        toast.error("Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsConfirmOpen(false);
    }
  };
  const handleEdit = (product) => {
    navigate(`/seller/products/edit/${product.id}`, { state: { product } });
  };

  // Excel indir
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ürünler");
    XLSX.writeFile(wb, "urunler.xlsx");
  };

  // Tab filtreleme
  const tabFilteredProducts = products.filter((p) => {
    if (activeTab === "active") return p.active;
    if (activeTab === "inactive") return !p.active;
    if (activeTab === "outofstock") return p.stockQuantity === 0;
    return true;
  });

  // Arama & filtreleme
  const filteredProducts = tabFilteredProducts.filter((p) => {
    return (
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.modelNumber === "" || p.modelNumber?.includes(filters.modelNumber)) &&
      (filters.name === "" || p.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.brand === "" || p.brand?.toLowerCase().includes(filters.brand.toLowerCase())) &&
      (filters.categoryName === "" || p.categoryName?.toLowerCase().includes(filters.categoryName.toLowerCase()))
    );
  });

  // Sayfalama için veriler
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Başlık + arama */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-12 gap-4 md:gap-0">
        <AdminText> Ürünlerim <span className="text-xl">({products.length})</span></AdminText>

        <div className="relative md:w-2/4 w-full">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <AddButton onClick={() => navigate('/seller/products/add')}>
          <FaPlus />
          Ürün Ekle
        </AddButton>
      </div>

      {/* Tab menü */}
      <div className="flex gap-1 md:gap-4 border-b border-gray-200 mb-8 custom-font text-xs md:text-sm pt-8">
        {[
          { key: "all", label: "Tüm Ürünler", count: products.length },
          { key: "active", label: "Satışta Olanlar", count: products.filter((p) => p.active).length },
          { key: "inactive", label: "Satışta Olmayanlar", count: products.filter((p) => !p.active).length },
          { key: "outofstock", label: "Tükenenler", count: products.filter((p) => p.stockQuantity === 0).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            className={`pb-4 px-4 ${activeTab === tab.key
              ? "border-b-2 border-[var(--color-orange)] text-[var(--color-orange)] font-semibold"
              : "text-gray-600"
              }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Filtreleme */}
      <div className="p-4 bg-white rounded-md shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          className="border border-gray-200 p-2 rounded-lg focus:ring-1 focus:ring-[var(--color-orange)] outline-none"
          placeholder="Ürün Adı"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          className="border border-gray-200 p-2 rounded-lg focus:ring-1 focus:ring-[var(--color-orange)] outline-none"
          placeholder="Model Numarası"
          value={filters.modelNumber}
          onChange={(e) => setFilters({ ...filters, modelNumber: e.target.value })}
        />
        <input
          className="border border-gray-200 p-2 rounded-lg focus:ring-1 focus:ring-[var(--color-orange)] outline-none"
          placeholder="Marka"
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
        />
        <input
          className="border border-gray-200 p-2 rounded-lg focus:ring-1 focus:ring-[var(--color-orange)] outline-none"
          placeholder="Kategori"
          value={filters.categoryName}
          onChange={(e) => setFilters({ ...filters, categoryName: e.target.value })}
        />

        <div className="col-span-1 sm:col-span-2 md:col-span-4 flex flex-col sm:flex-row gap-2 justify-end mt-2">
          <button
            onClick={() => setFilters({ modelNumber: "", name: "", brand: "", categoryName: "" })}
            className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer"
          >
            Temizle
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center gap-2 bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition cursor-pointer justify-center"
          >
            <FaFilter /> Filtrele
          </button>
        </div>
      </div>

      {/* Sayfalama */}
      <div className="flex justify-end items-center py-8 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-0.5 border rounded-full disabled:opacity-50"
        >
          <GoChevronLeft />
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-0.5 border rounded-full disabled:opacity-50"
        >
          <GoChevronRight />
        </button>
      </div>

      {/* Ürün Tablosu */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 [&>tr>th]:border-b [&>tr>th]:border-gray-200">
            <tr>
              {["Ürün Bilgisi", "Kategori Adı", "Model Numarası", "Marka", "Fiyat", "Stok", "Durum", "İşlem"].map((head) => (
                <th key={head} className="p-3 text-left text-sm font-medium text-gray-600">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-none cursor-pointer"
                >
                  <td className="p-2 text-sm text-gray-700">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="p-2 text-sm text-gray-700">{product.categoryName}</td>
                  <td className="p-2 text-sm text-gray-700">{product.modelNumber}</td>
                  <td className="p-2 text-sm text-gray-700">{product.brand}</td>
                  <td className="p-2 text-sm text-gray-700">{product.price} TL</td>
                  <td className="p-2 text-sm text-gray-700">{product.stockQuantity}</td>
                  <td className="p-2 text-sm">
                    {product.active ? (
                      <span className="text-green-600 font-semibold">Aktif</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Pasif</span>
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-6 text-gray-400">
                  Ürün bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end py-8">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          <FaFileExcel /> Excel İndir
        </button>
      </div>

      {/* Silme Onay Dialogu */}
      {isConfirmOpen && (
        <ConfirmDialog
          message="Bu ürünü silmek istediğinize emin misiniz?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
};
export default Products;
