import { useState, useEffect } from 'react';
import { FaPlusCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { createAddress, fetchAddresses, deleteAddress, getAddressById, updateAddress } from "../../../services/addressService";
import { toast } from 'react-toastify';
const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // düzenlenen adresin id'si

  // formu state'i
  const [formData, setFormData] = useState({
    addressTitle: "",
    recipientName: "",
    phoneNumber: "",
    country: "",
    city: "",
    district: "",
    postalCode: "",
    fullAddress: "",
    isDefault: false,
  });

  //GET ADRESSES
  useEffect(() => {
    const getAddresses = async () => {
      try {
        const data = await fetchAddresses();
        setAddresses(data);
        console.log(data)
      } catch (error) {
        toast.error(error.message);
      }
    };
    getAddresses();
  }, []);

  //DÜZENLEME İÇİN ID
  const handleEditAddress = async (id) => {
    try {
      const address = await getAddressById(id);
      setFormData(address);
      setEditId(id); // düzenleme modu
      setShowModal(true);
    } catch (error) {
      toast.error("Adres yüklenemedi");
    }
  };

  //POST ADRESS
  //address formu input değişikliği
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateAddress(editId, formData);
        toast.success("Adres başarıyla güncellendi");
      } else {
        await createAddress(formData);
        toast.success("Adres başarıyla kaydedildi");
      }

      setShowModal(false); // Modalı kapat
      setEditId(null); // edit modunu sıfırla

      setFormData({
        addressTitle: "",
        recipientName: "",
        phoneNumber: "",
        country: "",
        city: "",
        district: "",
        postalCode: "",
        fullAddress: "",
        isDefault: false,
      });

      const data = await fetchAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      toast.success("Adres silindi");

      // Silme sonrası adresleri güncelle
      const data = await fetchAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error(error.message || "Adres silme işlemi başarısız");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Adres Bilgilerim</h2>

      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <p className="text-lg font-semibold text-gray-800 mb-1">{address.addressTitle}</p>
                <p className="text-gray-700">{address.recipientName}</p>
                <p className="text-gray-600">{address.city} / {address.country} , {address.postalCode}</p>
                <p className="text-gray-600">{address.fullAddress}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditAddress(address.id)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                  title="Adresi Düzenle"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                  title="Adresi Sil"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-base text-gray-500 italic mt-6 p-4 bg-gray-50 rounded-md">
            Henüz kayıtlı adresiniz bulunmamaktadır.
          </p>
        )}
      </div>

      <button
        onClick={() => {
          setShowModal(true);
          setEditId(null); // Güncelleme modunu kapat
          setFormData({    // Formu temizle
            addressTitle: "",
            recipientName: "",
            phoneNumber: "",
            country: "",
            city: "",
            district: "",
            postalCode: "",
            fullAddress: "",
            isDefault: false,
          });
        }}
        className="mt-6 flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold py-2 px-4 rounded-md border border-orange-600 hover:bg-orange-50 transition-colors duration-200">
        <FaPlusCircle />
        Yeni Adres Ekle
      </button>

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4"> {editId ? "Adresi Güncelle" : "Yeni Adres Ekle"}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input
                  type="text" name="addressTitle" placeholder="Adres Başlığı" value={formData.addressTitle}
                  onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
                  required
                />
                <input type="text" name="recipientName" placeholder="Ad-Soyad" value={formData.recipientName}
                  onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input type="tel" name="phoneNumber" placeholder="Telefon Numarası" value={formData.phoneNumber}
                  onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
                  required
                />
                <input type="text" name="country" placeholder="Ülke" value={formData.country}
                  onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input type="text" name="city" placeholder="Şehir" value={formData.city} onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
                  required
                />
                <input type="text" name="district" placeholder="İlçe" value={formData.district}
                  onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <input type="text" name="postalCode" placeholder="Posta Kodu" value={formData.postalCode}
                  onChange={handleInputChange} className="border border-gray-300 rounded px-3 h-10 col-span-1 outline-none"
                  required
                />
                <textarea name="fullAddress" placeholder="Adres Detayı" value={formData.fullAddress}
                  onChange={handleInputChange} className="border border-gray-300 rounded px-3 py-2 resize-none col-span-2 h-10 outline-none"
                  required
                />
              </div>

              <label className="inline-flex items-center mb-3">
                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange}
                  className="mr-2"
                /> Varsayılan adres olarak ayarla
              </label>

              <div className="flex justify-end gap-3">
                <button type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >İptal
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                > Kaydet
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
export default Addresses;