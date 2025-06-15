// src/components/Profile.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    birthDate: user?.birthDate || "",
    gender: user?.gender || ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log("Güncellenen veriler:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      birthDate: user?.birthDate || "",
      gender: user?.gender || ""
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profil Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{formData.name || "Kullanıcı Adı"}</h1>
              <p className="text-gray-600">{formData.email || "E-posta adresi"}</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2"
            >
              <FaEdit />
              Düzenle
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <FaSave />
                Kaydet
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <FaTimes />
                İptal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kişisel Bilgiler Kartı */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <FaUser />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Kişisel Bilgiler</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.name || "Belirtilmemiş"}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                    {formData.birthDate || "Belirtilmemiş"}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seçin</option>
                    <option value="erkek">Erkek</option>
                    <option value="kadın">Kadın</option>
                    <option value="belirtmek_istemiyorum">Belirtmek İstemiyorum</option>
                  </select>
                ) : (
                  <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                    {formData.gender || "Belirtilmemiş"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* İletişim Kartı */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <FaEnvelope />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">İletişim Bilgileri</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.email || "Belirtilmemiş"}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numarası</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0555 555 55 55"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.phone || "Belirtilmemiş"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bilgi */}
      {!isEditing && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            <strong>Bilgi:</strong> Kişisel bilgilerinizi güncel tutarak size daha iyi hizmet verebiliriz.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;