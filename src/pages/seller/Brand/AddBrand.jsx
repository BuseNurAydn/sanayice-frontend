import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminText from '../../../shared/Text/AdminText';
import { addBrand } from '../../../services/brandservice';
import { Upload } from "lucide-react";

const AddBrand = () => {
  const navigate = useNavigate();
  const [mainImageFile, setMainImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    imageUrl: "",
    active: true
  });

  // Ana resim dosyası yükleme handler'ı
  const handleMainImageUpload = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan büyük olamaz");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece JPG ve PNG dosyaları yüklenebilir');
      return;
    }

    setMainImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleRemoveImage = () => {
    setMainImageFile(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleClear = () => {
    setFormData({
      name: "",
      description: "",
      websiteUrl: "",
      imageUrl: "",
      active: true
    });
    setMainImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Marka adı ve açıklaması zorunludur!");
      return;
    }

    const newBrand = {
      name: formData.name,
      description: formData.description,
      websiteUrl: formData.websiteUrl,
      active: formData.active
    };

    // FormData oluşturma
    const form = new FormData();

    // Backend'in beklediği "brand" adında part ekle
    form.append("brand", JSON.stringify(newBrand));

    // Ana resim ekleme (opsiyonel)
    if (mainImageFile) {
      form.append("imageFile", mainImageFile);
    }

    try {
      await addBrand(form);
      toast.success("Marka başarıyla eklendi!");
      navigate('/seller/brand_list');
      handleClear();
      setMainImageFile(null);
    } catch (error) {
      console.error('Marka eklenirken hata oluştu:', error);
      toast.error(error.message || "Marka eklenirken bir hata oluştu");
    }
  };

  return (
    <div className="min-h-screen md:p-6 px-3 py-6 bg-gray-50">
      <div className="max-w-5xl">
        <AdminText>Marka Ekle</AdminText>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Marka Adı *</label>
            <input 
              type="text" 
              id='name' 
              value={formData.name} 
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Marka Açıklaması *</label>
            <textarea 
              id='description' 
              value={formData.description} 
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows="4" 
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Website URL</label>
            <input 
              type="url" 
              id='websiteUrl' 
              value={formData.websiteUrl} 
              onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-orange-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={formData.active} 
                onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                className="form-checkbox h-4 w-4 text-orange-600"
              />
              <span className="font-medium">Aktif</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Marka Logosu</label>
            {/* Ana Resim */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4 transition-colors"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => handleMainImageUpload(e.target.files[0]);
                input.click();
              }}
            >
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-center text-gray-600">Logo Yükle (Opsiyonel)</p>
              <p className="text-xs text-center text-gray-500 mt-1">Max 5MB - JPG, PNG</p>
            </div>

            {mainImageFile && (
              <div className="mb-4 relative w-fit">
                <img
                  src={URL.createObjectURL(mainImageFile)}
                  alt="Marka Logosu"
                  className="w-32 h-32 object-cover rounded border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 cursor-pointer transition-colors"
                  title="Resmi kaldır"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={handleClear}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Temizle
            </button>
            <button 
              type="submit" 
              className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;