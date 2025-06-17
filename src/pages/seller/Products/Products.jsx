import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import AdminText from "../../../shared/Text/AdminText";
import { useNavigate } from 'react-router-dom';
import AddButton from "../../../shared/Button/AddButton";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { fetchMyProducts, deleteProduct } from '../../../services/sellerProductService';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ Yükleme durumu eklendi

  const borderStyle = "border border-gray-300 p-2";

  // Ürünleri listeleme
  const fetchProducts = async () => {
    try {
      const data = await fetchMyProducts();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler alınırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    } catch (error) {
      console.error('Silme hatası:', error);
    } finally {
      setIsConfirmOpen(false);
      setSelectedProductId(null);
    }
  };

  const handleEdit = (product) => {
    navigate(`/seller/products/edit/${product.id}`, { state: { product } });
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <AdminText>Ürünlerim</AdminText>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Ürün adına göre filtrele..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-200 outline-none rounded-lg"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <AddButton onClick={() => navigate('/seller/products/add')}>Ürün Ekle</AddButton>
      </div>

      <div className="rounded-lg overflow-x-auto shadow border border-gray-200">
        <table className="w-full border-separate border-spacing-0 min-w-[600px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className={`${borderStyle} rounded-tl-lg w-2/12`}>Ürün Resmi</th>
              <th className={`${borderStyle} w-3/12`}>Ürün İsmi</th>
              <th className={`${borderStyle} w-2/12`}>Fiyat</th>
              <th className={`${borderStyle} w-2/12`}>Stok Adedi</th>
              <th className={`${borderStyle} w-2/12`}>Marka</th>
              <th className={`${borderStyle} rounded-tr-lg w-1/12`}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Ürünler yükleniyor...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="text-center">
                  <td className="border border-gray-300 py-2 px-2">
                    <div className="flex justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="mt-2 w-12 h-12 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className={borderStyle}>{product.name}</td>
                  <td className={borderStyle}>{product.price}</td>
                  <td className={borderStyle}>{product.stockQuantity}</td>
                  <td className={borderStyle}>{product.brand}</td>
                  <td className={borderStyle}>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800" title="Düzenle">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteClick(product.id)} className="text-red-600 hover:text-red-800" title="Sil">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Filtreye uygun ürün bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isConfirmOpen && (
          <ConfirmDialog
            message="Bu ürünü silmek istediğinize emin misiniz?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
