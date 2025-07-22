import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminText from '../../../shared/Text/AdminText';
import TechnicalSpecInput from '../../../shared/Input/TechnicalSpecInput'
import { updateProduct } from '../../../services/sellerProductService';

const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const labelStyle = 'block text-sm font-medium text-gray-700';
  const inputStyle = 'border border-gray-300 p-2 w-full rounded outline-none'

  const [formData, setFormData] = useState(() => ({
    price: product?.price || '',
    stockQuantity: product?.stockQuantity || '',
    imageUrl: product?.imageUrl || '',
    discount: product?.discount || '',
    highlightedFeatures: product?.highlightedFeatures || ['', '', ''],
    technicalSpecifications: product?.technicalSpecifications
      ? Object.entries(product.technicalSpecifications).map(([key, value]) => ({ key, value }))
      : [],
  }));

  // ✅ Eksik state'leri ekle
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(product?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.highlightedFeatures];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      highlightedFeatures: updatedFeatures,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: newSpecs,
    }));
  };

  const removeTechSpec = (index) => {
    const newSpecs = formData.technicalSpecifications.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      technicalSpecifications: newSpecs,
    }));
  };

  // ✅ Resim değiştiğinde çalışacak handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Resim dosyası 5MB\'dan küçük olmalıdır');
        return;
      }
      
      // Dosya tipi kontrolü
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sadece JPG, PNG ve WebP formatları desteklenmektedir');
        return;
      }
      
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(''); // Hata varsa temizle
      console.log('Yeni resim seçildi:', file.name, file.size + ' bytes');
    }
  };

  // ✅ Resim seçimini temizle
  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setPreviewImage(product?.imageUrl || ''); // Orijinal resme dön
    
    // File input'u temizle
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
    
    console.log('Resim seçimi temizlendi, orijinal resme dönüldü');
  };

  // URL'den blob oluşturup File objesine çevir
  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('URL\'den file dönüştürme hatası:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // ✅ Sadece formData'da bulunan alanları kullan
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('stockQuantity', parseInt(formData.stockQuantity));
    formDataToSend.append('discount', formData.discount ? parseFloat(formData.discount) : 0);
    
    // ✅ highlightedFeatures array olarak gönder
    formData.highlightedFeatures.forEach((feature, index) => {
      if (feature.trim()) {
        formDataToSend.append(`highlightedFeatures[${index}]`, feature);
      }
    });
    
    // Technical specifications - JSON string olarak gönder
    const techSpecsObject = {};
    formData.technicalSpecifications.forEach(spec => {
      if (spec.key && spec.value) {
        techSpecsObject[spec.key] = spec.value;
      }
    });
    formDataToSend.append('technicalSpecifications', JSON.stringify(techSpecsObject));
    
    // ✅ Diğer ürün özellikleri - sadece değişmeyenler
    formDataToSend.append('name', product.name);
    formDataToSend.append('description', product.description);
    formDataToSend.append('brand', product.brand);
    formDataToSend.append('modelNumber', product.modelNumber);
    formDataToSend.append('categoryId', product.categoryId);
    formDataToSend.append('subcategoryId', product.subcategoryId);
    formDataToSend.append('weightGrams', product.weightGrams || 0);
    formDataToSend.append('lengthMm', product.lengthMm || 0);
    formDataToSend.append('widthMm', product.widthMm || 0);
    formDataToSend.append('heightMm', product.heightMm || 0);
    formDataToSend.append('warrantyMonths', product.warrantyMonths || 0);
    formDataToSend.append('freeShipping', product.freeShipping || false);
    formDataToSend.append('shippingDays', product.shippingDays || 0);
    
    // Additional images - array olarak gönder
    if (product.additionalImages && product.additionalImages.length > 0) {
      formDataToSend.append('additionalImages', JSON.stringify(product.additionalImages));
    }
    
    // Resim işlemi
    try {
      if (selectedImageFile) {
        // Yeni resim seçildiyse
        formDataToSend.append('imageFile', selectedImageFile);
        console.log('Yeni resim yükleniyor:', selectedImageFile.name);
      } else if (product.imageUrl && !selectedImageFile) {
        // Mevcut resmi koru - URL'den File yap
        console.log('Mevcut resim korunuyor:', product.imageUrl);
        const imageFile = await urlToFile(product.imageUrl, `image_${product.id}.jpg`);
        if (imageFile) {
          formDataToSend.append('imageFile', imageFile);
          console.log('URL\'den File objesi oluşturuldu:', imageFile.name);
        } else {
          console.warn('Resim dosyası oluşturulamadı, resim olmadan devam ediliyor');
        }
      }
    } catch (imageError) {
      console.error('Resim işleme hatası:', imageError);
      // Resim hatası olsa bile diğer alanları güncellemeye devam et
    }
    
    // FormData içeriğini kontrol et (debug için)
    console.log('Gönderilecek veriler:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }
    
    try {
      setLoading(true); // Loading state'ini aktif et
      await updateProduct(product.id, formDataToSend);
      
      // Başarılı mesaj göster (isteğe bağlı)
      console.log('Ürün başarıyla güncellendi');
      
      // Ürünler sayfasına yönlendir
      navigate('/seller/products');
      
    } catch (err) {
      console.error('Ürün güncellenemedi:', err.message);
      setError(err.message || 'Ürün güncelleme sırasında bir hata oluştu');
    } finally {
      setLoading(false); // Loading state'ini pasif et
    }
  };

  return (
    <div className="min-h-screen py-6 px-3 md:p-6 bg-gray-50 ">
      <AdminText>Ürün Düzenleme</AdminText>

      {/* ✅ Hata mesajı göster */}
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

          <div>
            <label className={labelStyle}>İndirim (%)</label>
            <input 
              type="number" 
              name="discount" 
              value={formData.discount} 
              onChange={handleChange}
              className={inputStyle}
              disabled={loading}
            />
          </div>
        </div>

        {/* ✅ Resim yükleme kısmı ekle */}
        <div>
          <label className={labelStyle}>Ürün Resmi</label>
          
          {/* Mevcut resmi göster */}
          {previewImage && (
            <div className="mb-3">
              <img 
                src={previewImage} 
                alt="Ürün resmi" 
                className="w-32 h-32 object-cover rounded border"
              />
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                disabled={loading}
              >
                Resmi Değiştir
              </button>
            </div>
          )}
          
          {/* Dosya seçimi */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {selectedImageFile && (
            <p className="mt-1 text-sm text-gray-600">
              Seçilen dosya: {selectedImageFile.name}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Öne Çıkan Özellikler</h3>
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="text"
              className={`${inputStyle} mb-2`}
              placeholder={`Özellik ${i + 1}`}
              value={formData.highlightedFeatures[i]}
              onChange={(e) => handleFeatureChange(i, e.target.value)}
              disabled={loading}
            />
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Teknik Özellikler</h3>

          {formData.technicalSpecifications.map((spec, index) => (
            <TechnicalSpecInput 
              key={index} 
              spec={spec} 
              index={index} 
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