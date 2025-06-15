import AdminText from '../../../shared/Text/AdminText'
import { useState, useEffect } from 'react'
import { FaTrash } from "react-icons/fa";
import { fetchCategories, fetchSubcategories } from "../../../services/categoryService";
import {createProduct} from "../../../services/sellerProductService";

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
    imageUrl: "", // Ana resim URL'si
    categoryId: "",
    subcategoryId: "",
    highlightedFeatures: ["", "", ""],
    technicalSpecifications: { "": "" },
    additionalImages: ["", ""], // 2 ek resim
    weightGrams: "",
    lengthMm: "",
    widthMm: "",
    heightMm: "",
    warrantyMonths: "",
    freeShipping: false,
    shippingDays: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        const subcategoriesData = await fetchSubcategories();

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };
    fetchData();
  }, []);

  // Diğer form alanları için genel değişiklik handler'ı
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.highlightedFeatures];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, highlightedFeatures: newFeatures }));
  };

  //Teknik özellik ekleme,silme
  const handleTechSpecChange = (oldKey, newKey, newValue, isKeyChange) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.technicalSpecifications };

      if (isKeyChange) {
        // Anahtar değişmiş: eski key'i sil, yeni key ve değeri ekle
        delete newSpecs[oldKey];
        if (newKey) {
          newSpecs[newKey] = newValue || "";
        }
      } else {
        // Değer değişmiş
        newSpecs[oldKey] = newValue;
      }

      return {
        ...prev,
        technicalSpecifications: newSpecs,
      };
    });
  };

  // Yeni boş teknik özellik ekle
  const addTechSpec = () => {
    setFormData((prev) => {
      const newSpecs = { ...prev.technicalSpecifications };
      // boş bir key varsa, tekrar ekleme
      if (newSpecs.hasOwnProperty("")) return prev;

      return {
        ...prev,
        technicalSpecifications: {
          ...newSpecs,
          "": "",
        },
      };
    });
  };

  // Teknik özellik sil
  const removeTechSpec = (keyToRemove) => {
    setFormData((prev) => {
      const updatedSpecs = { ...prev.technicalSpecifications };
      delete updatedSpecs[keyToRemove];
      return {
        ...prev,
        technicalSpecifications: updatedSpecs,
      };
    });
  };
  /////////////////////////////////
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

    const productData = {
      ...formData,
      stockQuantity: parseInt(formData.stockQuantity),
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
      subcategoryId: parseInt(formData.subcategoryId),
      weightGrams: parseInt(formData.weightGrams),
      lengthMm: parseInt(formData.lengthMm),
      widthMm: parseInt(formData.widthMm),
      heightMm: parseInt(formData.heightMm),
      warrantyMonths: parseInt(formData.warrantyMonths),
      freeShipping: Boolean(formData.freeShipping),
      shippingDays: parseInt(formData.shippingDays)
    };

    try {
      await createProduct(productData);  //servisi kullandık
      alert("Ürün başarıyla eklendi!");
      console.log("Form gönderildi:", formData);
    } catch (error) {
      console.error(error);
      alert('Sunucu hatası!');
    }
  };

  const filteredSubcategories = subcategories.filter(
    sub => sub.categoryId === parseInt(formData.categoryId)
  );
  const handleClear = () => {
  setFormData({
    name: "",
    description: "",
    brand: "",
    modelNumber: "",
    stockQuantity: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    subcategoryId: "",
    highlightedFeatures: ["", "", ""],
    technicalSpecifications: { "": "" },
    additionalImages: ["", ""],
    weightGrams: "",
    lengthMm: "",
    widthMm: "",
    heightMm: "",
    warrantyMonths: "",
    freeShipping: false,
    shippingDays: ""
  });
};


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
              <select id="categoryId" required className={inputStyle} value={formData.categoryId}
                onChange={handleCategoryChange}>
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
          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Öne Çıkan Özellikler</h3>
            <div className={lineStyle} />
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="text"
                className={inputStyle}
                placeholder={`Özellik ${i + 1}`}
                value={formData.highlightedFeatures[i]}
                onChange={(e) => handleFeatureChange(i, e.target.value)}
              />
            ))}
          </div>

          <div className={boxStyle}>
            <h3 className="font-semibold mb-2">Teknik Özellikler</h3>
            <div className={lineStyle} />

            <div className="flex flex-wrap">
              {Object.entries(formData.technicalSpecifications).map(([key, value], idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <input
                    placeholder="Özellik Adı"
                    value={key}
                    onChange={(e) =>
                      handleTechSpecChange(key, e.target.value, value, true)
                    }
                    className='border-gray-200 outline-none border px-3 py-2 rounded-lg mr-2'
                  />
                  <input
                    placeholder="Değeri"
                    value={value}
                    onChange={(e) =>
                      handleTechSpecChange(key, key, e.target.value, false)
                    }
                    className='border-gray-200 outline-none border px-3 py-2 rounded-lg mr-4'
                  />
                  <button
                    type="button"
                    onClick={() => removeTechSpec(key)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTechSpec}
                className="mt-2 px-4 py-1 bg-amber-500 text-white rounded"
              >
                Özellik Ekle
              </button>

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
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <label className={labelStyle}>Ağırlık (gram)</label>
                <input
                  type="number"
                  className={inputStyle}
                  value={formData.weightGrams}
                  onChange={(e) => setFormData({ ...formData, weightGrams: +e.target.value })}
                />
              </div>

              <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <label className={labelStyle}>Uzunluk (mm)</label>
                <input
                  type="number"
                  className={inputStyle}
                  value={formData.lengthMm}
                  onChange={(e) => setFormData({ ...formData, lengthMm: +e.target.value })}
                />
              </div>

              <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <label className={labelStyle}>Genişlik (mm)</label>
                <input
                  type="number"
                  className={inputStyle}
                  value={formData.widthMm}
                  onChange={(e) => setFormData({ ...formData, widthMm: +e.target.value })}
                />
              </div>

              <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <label className={labelStyle}>Yükseklik (mm)</label>
                <input
                  type="number"
                  className={inputStyle}
                  value={formData.heightMm}
                  onChange={(e) => setFormData({ ...formData, heightMm: +e.target.value })}
                />
              </div>

              <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <label className={labelStyle}>Garanti Süresi (ay)</label>
                <input
                  type="number"
                  className={inputStyle}
                  value={formData.warrantyMonths}
                  onChange={(e) => setFormData({ ...formData, warrantyMonths: +e.target.value })}
                />
              </div>
              <div className="w-full sm:w-[calc(50%-0.5rem)]">
                <label className={labelStyle}>Kargo Süresi (gün)</label>
                <input
                  type="number"
                  className={inputStyle}
                  value={formData.shippingDays}
                  onChange={(e) => setFormData({ ...formData, shippingDays: +e.target.value })}
                />
              </div>
              <div className="w-full sm:w-[calc(50%-0.5rem)] flex items-center gap-2">
                <input type="checkbox" id="freeShipping" checked={formData.freeShipping}
                  onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                />
                <label htmlFor="freeShipping" className={labelStyle}>Ücretsiz Kargo</label>
              </div>
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
            <h3 className="font-semibold mb-2">Ürün Görselleri</h3>
            <div className={lineStyle} />

            {formData.additionalImages.map((url, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className={inputStyle}
                  placeholder={`Görsel URL ${index + 1}`}
                  value={url}
                  onChange={(e) => {
                    const updatedImages = [...formData.additionalImages];
                    updatedImages[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      additionalImages: updatedImages,
                    }));
                  }}
                />
                {url && (
                  <img src={url} alt={`Görsel ${index + 1}`} className="w-16 h-16 object-cover border rounded" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    const filtered = formData.additionalImages.filter((_, i) => i !== index);
                    setFormData((prev) => ({
                      ...prev,
                      additionalImages: filtered,
                    }));
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  additionalImages: [...prev.additionalImages, ""],
                }))
              }
              className="mt-2 px-4 py-1 bg-amber-500 text-white rounded"
            >
              Görsel Ekle
            </button>
          </div>
        </div>
      </form>
      {/* Butonlar */}
      <div className="mt-8 flex md:gap-4 gap-x-2 justify-center">
        <button type="submit" className={buttonStyle} onClick={handleSubmit}>Ürünü Kaydet</button>
        <button type="button" className={buttonStyle} onClick={handleClear}>Temizle</button>
        <button type="button" className={buttonStyle}>Dökümanı Yazdır</button>
      </div>
    </div>
  );
};
export default AddProduct;
