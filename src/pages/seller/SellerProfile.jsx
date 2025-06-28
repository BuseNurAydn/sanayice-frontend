import AdminText from '../../shared/Text/AdminText'
import { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../../services/authService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    phoneNumber: "",
    companyName: "",
    taxId: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setFormData({
          name: data.name || "",
          lastname: data.lastname || "",
          phoneNumber: data.phoneNumber || "",
          companyName: data.companyName || "",
          taxId: data.taxId || "",
        });
        console.log(data);
      } catch (err) {
        console.error("Profil alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMyProfile(formData);
      toast.success("Profil başarıyla güncellendi.");
    } catch (err) {
      toast.error("Profil güncellenemedi.");
    }
  };


  const boxStyle = 'border border-gray-200 p-6 rounded-lg shadow bg-white';
  const labelStyle = 'block text-sm font-medium text-gray-900 pb-1';
  const valueStyle = 'text-gray-800 text-base mb-2';
  const buttonStyle = "bg-[var(--color-orange)] text-white px-4 py-2 rounded-lg font-semibold";
  const inputStyle = 'w-full border-gray-200 outline-none border px-3 py-2 rounded-lg mb-3 bg-gray-50';

  return (
    <div className='min-h-screen py-8 px-4 bg-[var(--color-light)]'>
      <div className='max-w-3xl mx-auto'>
        <AdminText>
          {user?.role === "ROLE_MANAGER" ? "Yönetici Profili" : "Satıcı Profili"}
        </AdminText>
        <div className={boxStyle + ' mt-6 flex flex-col items-center'}>
          <div className="mb-6">
            <img
              src={profile?.profileImage}
              alt="Profil"
              className="rounded-full w-28 h-28 object-cover border-4 border-[var(--color-orange)] shadow"
            />
          </div>
          <form onSubmit={handleSubmit} className="w-full grid md:grid-cols-2 gap-6">
            {/* Sol taraf */}
            <div>
              <label className={labelStyle}>Adı</label>
              <input type="text" name='name' value={formData.name} onChange={handleChange} className={inputStyle} />

              <label className={labelStyle}>Soyadı</label>
              <input type="text" name='lastname' value={formData.lastname} onChange={handleChange} className={inputStyle} />
            </div>
            {/* Sağ taraf */}
            <div>
              <label className={labelStyle}>Telefon Numarası</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputStyle} />

              <label className={labelStyle}>E-posta</label>
              <input type="email" name='email' className={inputStyle} defaultValue={profile?.email} />
            </div>
            {/* Butonlar */}
            <div className="mt-8 flex gap-4">
              <button type="submit" className={buttonStyle}>
                Bilgileri Kaydet
              </button>
              <button type="button" className={buttonStyle + " bg-gray-500 hover:bg-gray-600"}>
                Düzenlemeyi İptal Et
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SellerProfile;
