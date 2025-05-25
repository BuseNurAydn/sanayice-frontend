import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import AdminText from '../../../shared/Text/AdminText';

const EditProduct = () => {
  const location = useLocation();
  const product = location.state?.product;
  const [previewImage, setPreviewImage] = useState(product?.imageUrl || '');
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const hStyle = 'font-semibold custom-font text-lg';
  const inputStyle = 'border border-gray-300 p-2 w-full rounded outline-none';

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFileName(file.name); 
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFileName('');
      setPreviewImage('');
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append('name', form.name.value);
    formData.append('price', form.price.value);
    formData.append('stock', form.stock.value);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    console.log('Form verisi hazır:', formData);
  };

  return (
    <div className="min-h-screen md:w-2/3 ">
      <AdminText>Ürün Düzenleme</AdminText>

      {/* Görsel Önizleme */}
      {previewImage && (
        <div className="relative w-40 h-40 my-4">
          <img src={previewImage} alt="Ürün Görseli" className="w-full h-full object-cover rounded border"/>
          <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            title="Sil"> ✕
          </button>
        </div>
      )}

      <div>
          <div className="flex items-center gap-4">
            <label className="inline-block my-4 bg-gray-100 border border-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 text-sm relative">
              Dosya Seç
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
            </label>

            {fileName && (
              <span className="text-gray-600 text-sm italic truncate max-w-xs">{fileName}</span>
            )}
          </div>
        </div>


      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <h1 className={hStyle}>Ürün Adı</h1>
          <input type="text" name="name" defaultValue={product?.name || ''} className={inputStyle}/>
        </div>

        <div>
          <h1 className={hStyle}>Fiyat</h1>
          <input type="text" name="price" defaultValue={product?.price || ''} className={inputStyle}/>
        </div>

        <div>
          <h1 className={hStyle}>Stok</h1>
          <input type="number" name="stock" defaultValue={product?.stock || ''} className={inputStyle}/>
        </div>

        
        <div className="text-right">
          <button type="submit" className="bg-[var(--color-dark-orange)] text-white px-6 py-2 rounded">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditProduct;


