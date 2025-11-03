import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import AdminText from '../../../shared/Text/AdminText';
import TechnicalSpecInput from '../../../shared/Input/TechnicalSpecInput';
import { toast } from 'react-toastify';
import { Upload } from "lucide-react";
import { updateProduct, toggleProductStatus } from '../../../services/sellerProductService';

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
    active: product?.active ?? true,
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(product?.imageUrls?.[0] || '');
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImageUrls, setAdditionalImageUrls] = useState(product?.imageUrls?.slice(1) || []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //Zorunlu File dönüşümü yerine preview URL. Preview için mevcut URL’leri state’e attım.
  //Kullanıcı resme dokunmazsa,mevcut URL ile göster ve File göndermeye.Yani sadece kullanıcı yeni bir dosya seçerse onu File olarak formData’ya ekle.
  useEffect(() => {
    if (product) {
      setMainImageUrl(product.imageUrls?.[0] || '');
      setAdditionalImageUrls(product.imageUrls?.slice(1) || []);
    }
  }, [product]);

  // Öne çıkan özellikler
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.highlightedFeatures];
    updatedFeatures[index] = value;
    setFormData(prev => ({ ...prev, highlightedFeatures: updatedFeatures }));
  };

  // Basit input değişimi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Teknik özellikler
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

  // Ana resim
  const handleMainImageUpload = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ana resim dosyası 5MB\'dan küçük olmalıdır');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Sadece JPG, PNG ve WebP formatları desteklenmektedir');
      return;
    }
    setMainImageFile(file);
    setMainImageUrl(''); // URL preview devre dışı
    setError('');
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImageUrl('');
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  const removeAdditionalImageUrl = (index) => {
    setAdditionalImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Ek resimler 
  const handleAdditionalImagesUpload = (files) => {
    const filesArr = Array.from(files);
    const validFiles = [];
    for (const file of filesArr) {
      if (file.size > 5 * 1024 * 1024) continue;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) continue;
      validFiles.push(file);
    }
    if (validFiles.length > 0) setAdditionalImageFiles(prev => [...prev, ...validFiles]);
  };
  const removeAdditionalImageFile = (index) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Durum toggle
  const handleToggleStatus = async (id) => {
    try {
      const updated = await toggleProductStatus(id);
      if (updated.active !== undefined) {
        setFormData(prev => ({ ...prev, active: updated.active }));
      }
      toast.success("Ürün durumu başarıyla güncellendi!");
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
      toast.error("Ürün durumu güncellenemedi!");
    }
  };

  // URL'den File oluştur
const urlToFile = async (url, filename, mimeType) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType || blob.type });
};

  // Form submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!mainImageFile && !mainImageUrl) {
    toast.error("Ana resim yüklemek zorunludur!");
    setLoading(false);
    return;
  }

  try {
    const updatedProduct = {};

    // Temel alanlar
    if (parseFloat(formData.price) !== product.price) updatedProduct.price = parseFloat(formData.price);
    if (parseInt(formData.stockQuantity) !== product.stockQuantity) updatedProduct.stockQuantity = parseInt(formData.stockQuantity);
    if (formData.active !== product.active) updatedProduct.active = formData.active;

    // Öne çıkan özellikler
    const newFeatures = formData.highlightedFeatures.filter(f => f.trim() !== "");
    if (JSON.stringify(newFeatures) !== JSON.stringify(product.highlightedFeatures)) {
      updatedProduct.highlightedFeatures = newFeatures;
    }

    // Teknik özellikler
    const newTechSpecs = {};
    formData.technicalSpecifications.forEach(({ key, value }) => {
      if (key && value) newTechSpecs[key] = value;
    });
    if (JSON.stringify(newTechSpecs) !== JSON.stringify(product.technicalSpecifications)) {
      updatedProduct.technicalSpecifications = newTechSpecs;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("product", JSON.stringify(updatedProduct));

    // Ana resim
    if (mainImageFile) {
      formDataToSend.append("imageFiles", mainImageFile);
    } else if (mainImageUrl) {
      const mainFile = await urlToFile(mainImageUrl, "mainImage.jpg");
      formDataToSend.append("imageFiles", mainFile);
    }

    // Ek resimler
    // 1. Yeni yüklenen ek resimler
    additionalImageFiles.forEach(file => formDataToSend.append("imageFiles", file));

    // 2. Değişmeyen ek resimler
    for (const url of additionalImageUrls) {
      const file = await urlToFile(url, url.split("/").pop());
      formDataToSend.append("imageFiles", file);
    }

    // Eğer hiçbir değişiklik yoksa
    if (Object.keys(updatedProduct).length === 0 && !mainImageFile && additionalImageFiles.length === 0 && additionalImageUrls.length === 0) {
      toast.info("Herhangi bir değişiklik yapılmamış!");
      setLoading(false);
      return;
    }

    const result = await updateProduct(product.id, formDataToSend);

    if (result.active !== undefined) {
      setFormData(prev => ({ ...prev, active: result.active }));
    }

    toast.success("Ürün onaya gönderildi!");
    navigate('/satici/urunlerim');
  } catch (error) {
    console.error('Ürün onaya gönderilemedi:', error);
    setError(error.message || 'Onaya gönderme sırasında bir hata oluştu');
    toast.error("Ürün onaya gönderilemedi!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen py-6 px-3 md:p-6 bg-gray-50">
      <AdminText>Ürün Düzenleme</AdminText>

      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* Basit alanlar */}
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
            <label className={labelStyle}>Fiyat (TL)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={inputStyle}
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className={labelStyle}>Ürün Aktif mi?</label>
            <input
              type="checkbox"
              checked={formData.active}
              disabled={loading}
              onChange={async () => {
                const newStatus = !formData.active;
                setFormData(prev => ({ ...prev, active: newStatus }));
                try {
                  setLoading(true);
                  await handleToggleStatus(product.id);
                } catch (error) {
                  setFormData(prev => ({ ...prev, active: !newStatus }));
                } finally {
                  setLoading(false);
                }
              }}
            />
            <span className={`text-sm font-medium ${formData.active ? 'text-green-600' : 'text-red-500'}`}>
              {formData.active ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>

        {/* Öne çıkan özellikler */}
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

        {/* Teknik özellikler */}
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

        {/* Ürün görselleri */}
        <div>
          <h3 className="font-semibold mb-2">Ürün Görselleri</h3>

          {/* Ana resim */}
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

          {(mainImageFile ? URL.createObjectURL(mainImageFile) : mainImageUrl) && (
            <div className="mb-4 relative w-32 h-32 rounded overflow-hidden border border-gray-300">
              <img
                src={mainImageFile ? URL.createObjectURL(mainImageFile) : mainImageUrl}
                alt="Ana Resim"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 hover:bg-red-800"
                disabled={loading}
              >
                ×
              </button>
            </div>
          )}

          {/* Ek resimler */}
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 hover:bg-red-800"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            ))}
            {/* Server’daki mevcut ek resimler */}
            {additionalImageUrls.map((url, i) => (
              <div key={`url-${i}`} className="relative w-20 h-20 rounded overflow-hidden border border-gray-300">
                <img
                  src={url}
                  alt={`Ek Resim ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAdditionalImageUrl(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 hover:bg-red-800"
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
            className={`px-6 py-2 rounded-md font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
            disabled={loading}
          >
            {loading ? 'Onaya Gönderiliyor...' : 'Onaya Gönder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
