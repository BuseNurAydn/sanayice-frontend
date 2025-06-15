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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      highlightedFeatures: formData.highlightedFeatures,
      technicalSpecifications: techSpecsObject,
      imageUrl: formData.imageUrl,
      additionalImages: product.additionalImages,
      weightGrams: product.weightGrams,
      lengthMm: product.lengthMm,
      widthMm: product.widthMm,
      heightMm: product.heightMm,
      warrantyMonths: product.warrantyMonths,
      freeShipping: product.freeShipping,
      shippingDays: product.shippingDays,
    };

    try {
      await updateProduct(product.id, updatedProduct);
      navigate('/seller/products');
    } catch (err) {
      console.error('Ürün güncellenemedi:', err.message);
    }
  };


  return (
    <div className="min-h-screen md:w-2/3 ">
      <AdminText>Ürün Düzenleme</AdminText>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelStyle}>Stok Adedi</label>
            <input type="number" name="stockQuantity" className={inputStyle} value={formData.stockQuantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelStyle}>Fiyat (₺)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>İndirim (%)</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>
        <div >
          <h3 className="font-semibold mb-2">Öne Çıkan Özellikler</h3>
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
        <div>
          <h3 className="font-semibold mb-2">Teknik Özellikler</h3>

          {formData.technicalSpecifications.map((spec, index) => (
            <TechnicalSpecInput key={index} spec={spec} index={index} onChange={handleTechSpecChange}
              onRemove={removeTechSpec}
            />
          ))}

          <button type="button" onClick={addTechSpec} className="mt-2 mb-4 px-3 py-1 bg-gray-200 rounded">
            Teknik Özellik Ekle
          </button>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-dark-orange text-white font-semibold px-6 py-2 rounded-md"
          > Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditProduct;


