import { Upload, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ title, formData, onChange, onSave, onClose, mainImageFile, setMainImageFile }) => {

const handleMainImageUpload = (file) => {
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan büyük olamaz");
      return;
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Sadece JPG ve PNG dosyaları yüklenebilir");
      return;
    }

    setMainImageFile(file);
    onChange({
      target: {
        name: "imageUrl",
        value: URL.createObjectURL(file),
      },
    });
  };

  const handleRemoveImage = () => {
    setMainImageFile(null);
    onChange({
      target: {
        name: "imageUrl",
        value: "",
      },
    });
  };

  const openFileSelector = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleMainImageUpload(file);
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <input
          type="text"
          name="name"
          placeholder="Ad"
          value={formData.name}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none"
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={formData.description}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none"
        />

        {/* Ana Resim Alanı */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 mb-4"
          onClick={openFileSelector}
        >
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-center text-gray-600">Yeni Resim Yükle</p>
        </div>

        {/* Seçili Resmi Göster */}
        {mainImageFile || formData.imageUrl ? (
          <div className="relative mb-4 inline-block">
            <img
              src={mainImageFile ? URL.createObjectURL(mainImageFile) : formData.imageUrl}
              alt="Ana Resim"
              className="w-32 h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ) : null}


        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer">
            İptal
          </button>
          <button onClick={onSave} className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded cursor-pointer">
            Kaydet
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Modal;

