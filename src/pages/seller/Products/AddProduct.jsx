import AdminText from '../../../shared/Text/AdminText'
import { useState, useEffect } from 'react'
import { FaTrash } from "react-icons/fa";
import { fetchCategories, fetchSubcategories } from "../../../services/categoryService";
import { createProduct } from "../../../services/sellerProductService";
import { toast } from 'react-toastify';
import { Upload } from "lucide-react";

const AddProduct = () => {
  const boxStyle = 'border border-gray-200 md:p-4 p-2 rounded-lg shadow';
  const lineStyle = 'w-full h-[1px] bg-gray-300 mb-4'
  const labelStyle = 'block text-sm font-medium text-gray-900 pb-2';
  const inputStyle = 'w-full border-gray-200 outline-none border px-3 py-2 rounded-lg mb-3';
  const buttonStyle = "bg-[var(--color-orange)] text-white px-4 py-2 rounded-lg text-md";

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    modelNumber: "",
    stockQuantity: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    highlightedFeatures: ["", "", ""],
    technicalSpecifications: { "": "" },
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

  // Kategori değiştiğinde alt kategori sıfırlanır
  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      categoryId: selectedId,
      subcategoryId: '', // Alt kategori sıfırlansın
    }));
  };

  // Ana resim dosyası yükleme handler'ı
  const handleMainImageUpload = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Dosya boyutu 5MB'dan büyük olamaz");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast('Sadece JPG ve PNG dosyaları yüklenebilir');
      return;
    }

    setMainImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  // Ek resimler dosyası yükleme handler'ı (çoklu dosya)
  const handleAdditionalImagesUpload = (fileList) => {
    const files = Array.from(fileList);
    setAdditionalImageFiles((prev) => [...prev, ...files]);
  };

  // Ek resim silme fonksiyonu
  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));

    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!mainImageFile) {
      toast.error("Ana resim yüklemek zorunludur!");
      return;
    }
  
    if (!formData.name || !formData.description || !formData.price) {
      toast.error("Gerekli alanları doldurun!");
      return;
    }
  
    const safeParseInt = (val) => {
      const parsed = parseInt(val);
      return isNaN(parsed) ? null : parsed;
    };
  
    const safeParseFloat = (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };
  
    const productObj = {
      name: formData.name,
      description: formData.description,
      brand: formData.brand,
      modelNumber: formData.modelNumber,
      stockQuantity: safeParseInt(formData.stockQuantity),
      price: safeParseFloat(formData.price),
      categoryId: safeParseInt(formData.categoryId),
      subcategoryId: safeParseInt(formData.subcategoryId),
      highlightedFeatures: formData.highlightedFeatures.filter(f => f.trim() !== ""),
      technicalSpecifications: Object.fromEntries(
        Object.entries(formData.technicalSpecifications).filter(
          ([k, v]) => k.trim() && v.trim()
        )
      ),
      weightGrams: safeParseInt(formData.weightGrams),
      lengthMm: safeParseInt(formData.lengthMm),
      widthMm: safeParseInt(formData.widthMm),
      heightMm: safeParseInt(formData.heightMm),
      warrantyMonths: safeParseInt(formData.warrantyMonths),
      freeShipping: formData.freeShipping,
      shippingDays: safeParseInt(formData.shippingDays),
    };
  
    // FormData oluşturma
    const form = new FormData();
    
    // ✅ Backend'in beklediği "product" adında part ekle
    form.append("product", JSON.stringify(productObj));
    
    // ✅ Ana resim ekleme (imageFiles array'i olarak)
    if (mainImageFile) {
      form.append("imageFiles", mainImageFile);
    }
    
    // ✅ Ek resimleri ekleme
    additionalImageFiles.forEach((file) => {
      form.append("imageFiles", file);
    });
  
    try {
      const result = await createProduct(form);
      toast.success("Ürün başarıyla eklendi!");
      handleClear();
      setMainImageFile(null);
      setAdditionalImageFiles([]);
    } catch (error) {
      console.error("Hata detayı:", error);
      toast.error(`Ürün eklenemedi: ${error?.message || "Sunucu hatası"}`);
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
      categoryId: "",
      subcategoryId: "",
      highlightedFeatures: ["", "", ""],
      technicalSpecifications: { "": "" },
      weightGrams: "",
      lengthMm: "",
      widthMm: "",
      heightMm: "",
      warrantyMonths: "",
      freeShipping: false,
      shippingDays: ""
    });
    setMainImageFile(null);
    setAdditionalImageFiles([]);
  };
  return (
    <div className='min-h-screen bg-gray-50 px-3 py-6 md:p-6'>
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
                <div
                  key={idx}
                  className="flex flex-wrap md:flex-nowrap items-center gap-2 mb-4"
                >
                  <input
                    placeholder="Özellik Adı"
                    value={key}
                    onChange={(e) =>
                      handleTechSpecChange(key, e.target.value, value, true)
                    }
                    className="flex-1 min-w-[120px] border-gray-200 outline-none border p-2 rounded-lg"
                  />
                  <input
                    placeholder="Değeri"
                    value={value}
                    onChange={(e) =>
                      handleTechSpecChange(key, key, e.target.value, false)
                    }
                    className="flex-1 min-w-[120px] border-gray-200 outline-none border p-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechSpec(key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTechSpec}
                className="mt-2 md:px-4 md:py-1 px-2 py-1 bg-amber-500 text-white rounded"
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

            {/* Ana Resim */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => handleMainImageUpload(e.target.files[0]);
                input.click();
              }}
            >
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-center text-gray-600">Ana Resim Yükle</p>
            </div>

            {mainImageFile && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(mainImageFile)}
                  alt="Ana Resim"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
            {/* Ek Resimler */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.multiple = true;
                input.onchange = (e) => handleAdditionalImagesUpload(e.target.files);
                input.click();
              }}
            >
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-center text-gray-600">Ek Resim(ler) Yükle</p>
            </div>

            {additionalImageFiles.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {additionalImageFiles.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Ek ${idx + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
      {/* Butonlar */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
        <button type="submit" className={buttonStyle} onClick={handleSubmit}>Ürünü Kaydet</button>
        <button type="button" className={buttonStyle} onClick={handleClear}>Temizle</button>
      </div>
    </div>
  );
};
export default AddProduct;
