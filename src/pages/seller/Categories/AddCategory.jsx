import {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminText from '../../../shared/Text/AdminText';
import { addCategory } from '../../../services/categoryService';

const AddCategory = () => {
//const [image, setImage] = useState(null);
//const [previewImage, setImagePreview] = useState(null);
//const [imageFile, setImageFile] = useState(null);
//const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
{/*
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFileName(file.name); 
      setImagePreview(URL.createObjectURL(file));
      setImage(file); 
    } else {
      setFileName('');
      setImagePreview('');
      setImage(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImage(null);
  };
 */}
  const handleSubmit = async (e) => {
    e.preventDefault();

     const newCategory = {
      name: name,
      description: description,
      imageUrl: imageUrl,
    };

   try {
      await addCategory(newCategory);
      navigate('/seller/categories');
    } catch (error) {
      console.error('Kategori eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
      <AdminText>Kategori Ekle</AdminText>
{/** 
      {previewImage && (
        <div className="relative w-40 h-40 my-4">
          <img src={previewImage} alt="Ürün Görseli" className="w-full h-full object-cover rounded border"/>
          <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" title="Sil">✕</button>
        </div>
      )}

      <div>
        <div className="flex items-center gap-4">
          <label className="inline-block my-4 bg-gray-100 border border-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 text-sm relative">
            Resim Ekle
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
          </label>
          {fileName && <span className="text-gray-600 text-sm italic truncate max-w-xs">{fileName}</span>}
        </div>
      </div>
*/}
      <form onSubmit={handleSubmit}  className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Kategori Adı</label>
          <input type="text" id='name' value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Kategori Açıklaması</label>
          <textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)}
            rows="4" className="w-full border border-gray-300 rounded px-3 py-2 outline-none"/>
        </div>
         <div>
          <label className="block mb-1 font-medium">Resim Ekle</label>
          <input id='imageUrl' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} 
          placeholder="https://example.com/resim.jpg" className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
          />
        </div>

        <div className="text-right">
          <button type="submit" className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded transition"
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
