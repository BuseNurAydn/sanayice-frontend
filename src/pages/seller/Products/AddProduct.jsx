import AdminText from '../../../shared/Text/AdminText'
import { useState, useEffect } from 'react'

const AddProduct = () => {

  const boxStyle = 'border border-gray-200 p-4 rounded-lg shadow';
  const lineStyle = 'w-full h-[1px] bg-gray-300 mb-4'
  const labelStyle = 'block text-sm font-medium text-gray-900 pb-2';
  const inputStyle = 'w-full border-gray-200 outline-none border px-3 py-2 rounded-lg mb-3';
  const buttonStyle = "bg-[var(--color-orange)] text-white md:px-4 md:py-2 px-2 py-1 rounded-lg";

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    modelNumber: "",
    stockQuantity: "",
    price: "",
    imageUrl: "", // Tek resim URL'si
    categoryId: "",
    subcategoryId: "",
  });

// Kategori ve Alt Kategorileri Yükle
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Token'ı localStorage'dan al

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const [catRes, subcatRes] = await Promise.all([
        fetch("/api/managers/categories", { headers }),
        fetch("/api/managers/subcategories", { headers })
      ]);

      if (!catRes.ok || !subcatRes.ok) {
        throw new Error("Yetkisiz erişim. Lütfen giriş yapın.");
      }

      const categoriesData = await catRes.json();
      const subcategoriesData = await subcatRes.json();

      // Güvenli veri kontrolü
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
    } catch (error) {
      console.error("Veriler yüklenemedi:", error.message);
    }
  };

  fetchData();
}, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Kategori değiştiğinde alt kategori sıfırlanır
  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      categoryId: selectedId,
      subcategoryId: '', // Alt kategori sıfırlansın
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const productData = {
      name: formData.name,
      description: formData.description,
      brand: formData.brand,
      modelNumber: formData.modelNumber,
      stockQuantity: parseInt(formData.stockQuantity || "0"),
      price: parseFloat(formData.price || "0"),
      imageUrl: formData.imageUrl,
      categoryId: parseInt(formData.categoryId),
      subcategoryId: parseInt(formData.subcategoryId),
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Ürün başarıyla eklendi!');
      } else {
        alert('Bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      alert('Sunucu hatası!');
    }
  };

  const filteredSubcategories = subcategories.filter(
    sub => sub.categoryId === parseInt(formData.categoryId)
  );

  return (
    <div className='min-h-screen'>
      <AdminText>Ürün Ekle</AdminText>

      {/* Form Alanı */}
      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Form */}
        <div className="space-y-6">
          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ad ve Açıklama</h3>
            <div className={lineStyle} />

            <div>
              <label htmlFor="name" className={labelStyle}> Ürün Adı <span className="text-red-500">*</span></label>
              <input type="text" id="name" required className={inputStyle} value={formData.name}
                onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="description" className={labelStyle}>Ürün Açıklaması</label>
              <textarea id='description' className={inputStyle} value={formData.description} onChange={handleChange}
              />
            </div>
          </div>

          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Kategori</h3>
            <div className={lineStyle} />
            <div>
              <label htmlFor="categoryId" className={labelStyle}>Ürün Kategorisi <span className="text-red-500">*</span> </label>
              <select id="categoryId" required className={inputStyle} value={formData.categoryId} onChange={handleCategoryChange}>
                <option value="">Kategori Seçiniz</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subcategoryId" className={labelStyle}>Ürün Alt Kategorisi <span className="text-red-500">*</span></label>
              <select id="subcategoryId" required className={inputStyle} value={formData.subcategoryId} onChange={handleChange}>
                <option value="">Alt Kategori Seçiniz</option>
                {filteredSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sağ Form */}
        <div className="space-y-6">
          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ürün Detayları</h3>
            <div className={lineStyle} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="brand" className={labelStyle}> Marka <span className="text-red-500">*</span>
                </label>
                <input id='brand' required className={inputStyle} value={formData.brand} onChange={handleChange}></input>
                {/*
                <select id="brand" required className={inputStyle} value={formData.brand} onChange={handleChange}>
                  <option value="">Marka Seçiniz</option>
                  <option value="marka1">Marka 1</option>
                  <option value="marka2">Marka 2</option>
                </select> */}
              </div>

              <div>
                <label htmlFor="stockQuantity" className={labelStyle}>Stok Miktarı</label>
                <input type="number" id="stockQuantity" min="0" className={inputStyle} value={formData.stockQuantity} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="modelNumber" className={labelStyle}>Model Numarası <span className="text-red-500">*</span>
              </label>
              <input type="text" id="modelNumber" required className={inputStyle} value={formData.modelNumber}
                onChange={handleChange} />
            </div>
          </div>

          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ürün Fiyatı</h3>
            <div className={lineStyle} />
            <div>
              <label htmlFor="price" className={labelStyle}>Ürün Fiyat<span className="text-red-500">*</span>
              </label>
              <input type="number" id='price' min="0" className={inputStyle} value={formData.price} onChange={handleChange} />
            </div>
          </div>

          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Ürün Resmi</h3>
            <div className={lineStyle} />
            <input type="text" id="imageUrl" placeholder="https://example.com/resim.jpg" className={inputStyle} value={formData.imageUrl} onChange={handleChange} />
          </div>
        </div>
      </form>
      {/* Butonlar */}
      <div className="mt-8 flex md:gap-4 gap-x-2 justify-center">
        <button type="submit" className={buttonStyle} onClick={handleSubmit}>Ürünü Kaydet</button>
        <button type="button" className={buttonStyle} onClick={() => {
          setFormData({
            name: '',
            description: '',
            brand: '',
            modelNumber: '',
            stockQuantity: '',
            price: '',
            imageUrl: '',
            categoryId: 1,
            subcategoryId: 1,
          });
        }}>Temizle</button>
        <button type="button" className={buttonStyle}>Dökümanı Yazdır</button>
      </div>
    </div>
  );
};
export default AddProduct;
