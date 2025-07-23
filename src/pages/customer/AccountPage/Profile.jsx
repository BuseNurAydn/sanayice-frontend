import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { updateMyProfile, getMyProfile } from "../../../services/authService";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    shippingAddress: "",
    billingAddress: "",
    profileImage: null,
  });

  // Profil bilgilerini çek
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setFormData({
          name: data.name || "",
          lastname: data.lastname || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          billingAddress: data.billingAddress || "",
          shippingAddress: data.shippingAddress || "",
          profileImage: null,
        });
      } catch (err) {
        console.error("Profil alınamadı:", err);
        toast.error("Profil alınamadı.");
      }
    };
    fetchProfile();
  }, []);

  // Resim önizleme
  useEffect(() => {
    if (formData.profileImage) {
      const objectUrl = URL.createObjectURL(formData.profileImage);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (profile?.profileImageUrl) {
      setPreview(profile.profileImageUrl);
    }
  }, [formData.profileImage, profile]);

  // Input değişikliklerini yönet
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Kaydet
const handleSave = async (e) => {
  e.preventDefault();

  // Telefon numarasından sadece rakamları al
  const cleanedPhone = formData.phoneNumber.replace(/\D/g, ""); // 0, -, boşluk vs. silinir
  const finalPhone = cleanedPhone ? `+90${cleanedPhone}` : "";

  // Yeni güncellenmiş formData
  const updatedFormData = {
    ...formData,
    phoneNumber: finalPhone,
  };

  try {
    await updateMyProfile(updatedFormData);
    const updated = await getMyProfile();
    setProfile(updated);
    setIsEditing(false);
    toast.success("Profil başarıyla güncellendi.");
  } catch (err) {
    toast.error("Profil güncellenemedi.");
  }
};


  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // sadece rakamlar

    // 0 ile başlıyorsa sil
    if (input.startsWith("0")) input = input.slice(1);

    // En fazla 10 rakam (Türkiye cep numarası)
    input = input.slice(0, 10);

    // Formatlı gösterim: 5XX XXX XX XX
    let formatted = input;
    if (input.length >= 4) {
      formatted = `${input.slice(0, 3)} ${input.slice(3, 6)}`;
    }
    if (input.length >= 7) {
      formatted = `${input.slice(0, 3)} ${input.slice(3, 6)} ${input.slice(6, 8)}`;
    }
    if (input.length === 10) {
      formatted = `${input.slice(0, 3)} ${input.slice(3, 6)} ${input.slice(6, 8)} ${input.slice(8, 10)}`;
    }

    setFormData((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
  };

  // İptal
  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      lastname: profile?.lastname || "",
      phoneNumber: profile?.phoneNumber || "",
      email: profile?.email || "",
      billingAddress: profile?.billingAddress || "",
      shippingAddress: profile?.shippingAddress || "",
      profileImage: null,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profil Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={preview || "/default-profile.png"}
                alt="Profil Fotoğrafı"
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-orange-600 text-white text-xs px-2 py-1 rounded cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                  Değiştir
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        profileImage: e.target.files[0] || null,
                      }))
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {formData.name || "Kullanıcı Adı"}
              </h1>
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

      {/* Bilgi Kartları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kişisel Bilgiler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <FaUser />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Kişisel Bilgiler</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.name || "Belirtilmemiş"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.lastname || "Belirtilmemiş"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teslimat Adresi</label>
              {isEditing ? (
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.shippingAddress || "Belirtilmemiş"}
                </div>
              )}
            </div>
            {/**
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fatura Adresi</label>
              {isEditing ? (
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.billingAddress || "Belirtilmemiş"}
                </div>
              )}
            </div>
             */}
          </div>
        </div>

        {/* İletişim Bilgileri */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="5XX XXX XX XX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-gray-800">
                  {formData.phoneNumber || "Belirtilmemiş"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
