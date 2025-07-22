import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import AdminText from '../../../shared/Text/AdminText';
import TechnicalSpecInput from '../../../shared/Input/TechnicalSpecInput';
import { updateProduct } from '../../../services/sellerProductService';
import { toast } from 'react-toastify';
import { Upload } from "lucide-react";

const EditProduct = () => {
 

  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const labelStyle = 'block text-sm font-medium text-gray-700';
  const inputStyle = 'border border-gray-300 p-2 w-full rounded outline-none';

  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);

  const [formData, setFormData] = useState({
    price: product?.price || '',
    stockQuantity: product?.stockQuantity || '',
    highlightedFeatures: product?.highlightedFeatures?.length ? product.highlightedFeatures : ['', '', ''],
    technicalSpecifications: product?.technicalSpecifications
      ? Object.entries(product.technicalSpecifications).map(([key, value]) => ({ key, value }))
      : [],
  });

  // main ve ek resimlerin state'leri
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(product?.imageUrls?.[0] || '');

  const [additionalImageUrls, setAdditionalImageUrls] = useState(product?.imageUrls?.slice(1) || []);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

  // Eksik state'leri ekle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // URL'den File objesi oluşturmak için yardımcı fonksiyon
  async function urlToFile(url, filename, mimeType) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], filename, { type: mimeType });
    } catch (error) {
      console.error('URL\'den file dönüştürme hatası:', error);
      return null;
    }
  }

  // Component yüklendiğinde URL'leri File objesine çeviriyoruz
  useEffect(() => {
    async function convertImages() {
      try {
        // Ana resim URL'sini File'a çevir
        if (mainImageUrl && !mainImageFile) {
          const file = await urlToFile(mainImageUrl, "main-image.jpg", "image/jpeg");
          if (file) {
            setMainImageFile(file);
            setMainImageUrl('');
          }
        }

        // Ek resimlerin URL'lerini File'lara çevir
        if (additionalImageUrls.length > 0 && additionalImageFiles.length === 0) {
          const files = await Promise.all(
            additionalImageUrls.map((url, i) => urlToFile(url, `additional-image-${i}.jpg`, "image/jpeg"))
          );
          
          // Null olmayan dosyaları filtrele
          const validFiles = files.filter(file => file !== null);
          if (validFiles.length > 0) {
            setAdditionalImageFiles(validFiles);
            setAdditionalImageUrls([]);

          }
        }
      } catch (error) {
        console.error('Resim dönüştürme sırasında hata:', error);
        setError('Resimler yüklenirken bir hata oluştu');
      }
    }
    
    // Product varsa dönüştürme işlemini başlat
    if (product) {
      convertImages();
    }
  }, [product, mainImageUrl, mainImageFile, additionalImageUrls, additionalImageFiles.length]);

  // Diğer event handlerlar
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.highlightedFeatures];
    updatedFeatures[index] = value;
    setFormData(prev => ({ ...prev, highlightedFeatures: updatedFeatures }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTechSpec = () => {
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: [...prev.technicalSpecifications, { key: '', value: '' }],
    }));
  };

  const handleTechSpecChange = (index, field, value) => {
    const newSpecs = [...formData.technicalSpecifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, technicalSpecifications: newSpecs }));
  };

  const removeTechSpec = (index) => {
    const newSpecs = formData.technicalSpecifications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, technicalSpecifications: newSpecs }));
  };

  const handleMainImageUpload = (file) => {
    if (file) {
      // Dosya boyutu kontrolü (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ana resim dosyası 5MB\'dan küçük olmalıdır');
        return;
      }
      
      // Dosya tipi kontrolü
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sadece JPG, PNG ve WebP formatları desteklenmektedir');
        return;
      }

      setMainImageFile(file);
      setMainImageUrl('');
      setError(''); // Hata varsa temizle
    }
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImageUrl('');
    
    // File input'u temizle
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
    
    console.log('Ana resim seçimi temizlendi');
  };

  const handleAdditionalImagesUpload = (files) => {
    const filesArr = Array.from(files);
    
    // Her dosya için boyut ve tip kontrolü
    const validFiles = [];
    for (const file of filesArr) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ek resim dosyası 5MB\'dan küçük olmalıdır');
        continue;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sadece JPG, PNG ve WebP formatları desteklenmektedir');
        continue;
      }
      
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setAdditionalImageFiles(prev => [...prev, ...validFiles]);
      setError(''); // Hata varsa temizle
      console.log('Yeni ek resimler eklendi:', validFiles.length, 'adet');
    }
  };

  const removeAdditionalImageFile = (index) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
    console.log('Ek resim silindi, index:', index);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImageFile) {
      toast.error("Ana resim yüklemek zorunludur!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const techSpecsObject = {};
      formData.technicalSpecifications.forEach(({ key, value }) => {
        if (key && value) {
          techSpecsObject[key] = value;
        }
      });

      const updatedProduct = {
        name: product.name,
        description: product.description,
        brand: product.brand,
        modelNumber: product.modelNumber,
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        highlightedFeatures: formData.highlightedFeatures.filter(f => f.trim() !== ""),
        technicalSpecifications: techSpecsObject,
        weightGrams: product.weightGrams,
        lengthMm: product.lengthMm,
        widthMm: product.widthMm,
        heightMm: product.heightMm,
        warrantyMonths: product.warrantyMonths,
        freeShipping: product.freeShipping,
        shippingDays: product.shippingDays,
      };

      const formDataToSend = new FormData();

      formDataToSend.append("product", JSON.stringify(updatedProduct));

      // Ana resim dosyası
      formDataToSend.append("imageFiles", mainImageFile);

      // Ek resim dosyaları
      additionalImageFiles.forEach(file => formDataToSend.append("imageFiles", file));

      // FormData içeriğini kontrol et (debug için)
      console.log('Gönderilecek veriler:');
      console.log('Ana resim:', mainImageFile ? mainImageFile.name : 'Yok');
      console.log('Ek resimler:', additionalImageFiles.length, 'adet');

      await updateProduct(product.id, formDataToSend);
      toast.success("Ürün başarıyla güncellendi!");
      navigate('/seller/products');

    } catch (error) {
      console.error('Ürün güncellenemedi:', error);
      const errorMessage = error.message || 'Ürün güncelleme sırasında bir hata oluştu';
      setError(errorMessage);
      toast.error("Ürün güncellenemedi, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-3 md:p-6 bg-gray-50">
      <AdminText>Ürün Düzenleme</AdminText>

      {/* Hata mesajı göster */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelStyle}>Stok Adedi</label>
            <input
              type="number"
              name="stockQuantity"
              className={inputStyle}
              value={formData.stockQuantity}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className={labelStyle}>Fiyat (₺)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={inputStyle}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Öne Çıkan Özellikler</h3>
          {[0, 1, 2].map(i => (
            <input
              key={i}
              type="text"
              className={`${inputStyle} mb-2`}
              placeholder={`Özellik ${i + 1}`}
              value={formData.highlightedFeatures[i] || ''}
              onChange={e => handleFeatureChange(i, e.target.value)}
              disabled={loading}
            />
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Teknik Özellikler</h3>
          {formData.technicalSpecifications.map((spec, idx) => (
            <TechnicalSpecInput
              key={idx}
              spec={spec}
              index={idx}
              onChange={handleTechSpecChange}
              onRemove={removeTechSpec}
            />
          ))}
          <button 
            type="button" 
            onClick={addTechSpec} 
            className="mt-2 mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Teknik Özellik Ekle
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Ürün Görselleri</h3>
          <div className="border-b border-gray-300 mb-4" />

          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4 text-center ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !loading && mainImageInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Ana Resim Yükle</p>
            <input
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleMainImageUpload(e.target.files[0])}
              disabled={loading}
            />
          </div>

          {(mainImageFile) && (
            <div className="mb-4 relative w-32 h-32 rounded overflow-hidden border border-gray-300">
              <img
                src={URL.createObjectURL(mainImageFile)}
                alt="Ana Resim"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 hover:bg-red-800"
                disabled={loading}
              >
                ×
              </button>
            </div>
          )}

          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4 text-center ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !loading && additionalImagesInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Ek Resim(ler) Yükle</p>
            <input
              ref={additionalImagesInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleAdditionalImagesUpload(e.target.files)}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            {additionalImageFiles.map((file, i) => (
              <div key={`file-${i}`} className="relative w-20 h-20 rounded overflow-hidden border border-gray-300">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Ek Resim ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAdditionalImageFile(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 hover:bg-red-800"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md font-semibold ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-dark-orange hover:bg-orange-600'
            } text-white`}
            disabled={loading}
          >
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;