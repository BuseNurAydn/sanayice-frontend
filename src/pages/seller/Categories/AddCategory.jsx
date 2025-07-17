import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminText from '../../../shared/Text/AdminText';
import { addCategory } from '../../../services/categoryService';
import { Upload } from "lucide-react";

const AddCategory = () => {

  const navigate = useNavigate();
  const [mainImageFile, setMainImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

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

  const handleRemoveImage = () => {
  setMainImageFile(null);
  setFormData((prev) => ({ ...prev, imageUrl: "" }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImageFile) {
    toast.error("Ana resim yüklemek zorunludur!");
    return;
  }

  if (!formData.name || !formData.description) {
    toast.error("Gerekli alanları doldurun!");
    return;
  }

    const newCategory = {
      name: formData.name,
      description: formData.description,
    };

    // FormData oluşturma
    const form = new FormData();

    // Backend'in beklediği "category" adında part ekle
    form.append("category", JSON.stringify(newCategory));

    // Ana resim ekleme
    if (mainImageFile) {
      form.append("imageFile", mainImageFile);
    }

    try {
      await addCategory(form);
      navigate('/seller/categories');
      handleClear();
      setMainImageFile(null);
    } catch (error) {
      console.error('Kategori eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className="min-h-screen md:p-6 px-3 py-6 bg-gray-50">
      <div className="max-w-5xl">
        <AdminText>Kategori Ekle</AdminText>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Kategori Adı</label>
            <input type="text" id='name' value={formData.name} onChange={(e) =>setFormData((prev) => ({ ...prev, name: e.target.value }))}

              className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Kategori Açıklaması</label>
            <textarea id='description' value={formData.description} onChange={(e) =>setFormData((prev) => ({ ...prev, description: e.target.value }))}

              rows="4" className="w-full border border-gray-300 rounded px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Resim Ekle</label>
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
              <div className="mb-4 relative w-fit">
                <img
                  src={URL.createObjectURL(mainImageFile)}
                  alt="Ana Resim"
                  className="w-32 h-32 object-cover rounded border border-gray-50"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 cursor-pointer"
                  title="Resmi kaldır"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          <div className="text-right">
            <button type="submit" onClick={handleSubmit} className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded transition"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddCategory;
