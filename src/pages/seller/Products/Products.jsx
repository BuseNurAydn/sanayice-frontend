import { useState} from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import AdminText from "../../../shared/Text/AdminText";
import { useNavigate } from 'react-router-dom';
import AddButton from "../../../shared/Button/AddButton";

const initialProducts = [
  {
    id: 1,
    name: "Ürün 1",
    price: "150₺",
    stock: 10,
    rating: "4.5",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv7RjmQXn0Ty28Uc1LYSsLHg-GtFdqT3eVjopvlJ3EdYjNI-JDzWb1XNCCgbPEAOhM3PE&usqp=CAU",
  },
  {
    id: 2,
    name: "Ürün 2",
    price: "250₺",
    stock: 5,
    rating: "4.8",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEUY77NL2u97oWdHWCTMf-7a-TMdNUg1UlQQ&s",
  },
  {
    id: 3,
    name: "Ürün 3",
    price: "250₺",
    stock: 5,
    rating: "4.8",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv7RjmQXn0Ty28Uc1LYSsLHg-GtFdqT3eVjopvlJ3EdYjNI-JDzWb1XNCCgbPEAOhM3PE&usqp=CAU",
  },
  {
    id: 4,
    name: "Ürün 4",
    price: "250₺",
    stock: 5,
    rating: "4.8",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEUY77NL2u97oWdHWCTMf-7a-TMdNUg1UlQQ&s",
  },
];
const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const borderStyle = "border border-gray-300 p-2";

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEdit = (id) => {
  const selectedProduct = products.find((product) => product.id === id);
  navigate('/seller/products/edit', { state: { product: selectedProduct } });
};

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <AdminText>Ürünlerim</AdminText>

      <div className="flex items-center justify-between mb-4">
        {/* Arama Kutusu */}
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
       
        <AddButton onClick={() => navigate('/seller/products/add')} className="">Ürün Ekle</AddButton>
      </div>

      <div className="rounded-lg overflow-x-auto shadow border border-gray-200">
      <table className="w-full border-separate border-spacing-0 min-w-[600px]">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className={`${borderStyle} rounded-tl-lg w-2/12`}>Ürün Resmi</th>
            <th className={`${borderStyle} w-3/12`} >Ürün İsmi</th>
            <th className={`${borderStyle} w-2/12`}>Ürün Fiyatı</th>
            <th className={`${borderStyle} w-2/12`}>Stok Adedi</th>
            <th className={`${borderStyle} w-2/12`}>Ürün Değerlendirme</th>
            <th className={`${borderStyle} rounded-tr-lg w-1/12`}>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border border-gray-300 py-2 px-2">
                  <div className="flex justify-center">
                    <img src={product.imageUrl} alt={product.name} className="mt-2 w-12 h-12 object-cover rounded"/>
                  </div>
                </td>
                <td className={borderStyle}>{product.name}</td>
                <td className={borderStyle}>{product.price}</td>
                <td className={borderStyle}>{product.stock}</td>
                <td className={borderStyle}>{product.rating}</td>
                <td className={borderStyle}>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleEdit(product.id)} className="text-blue-600 hover:text-blue-800"
                    title="Düzenle"
                    >
                    <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Filtreye uygun ürün bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};
export default Products;