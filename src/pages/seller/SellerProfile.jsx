import AdminText from '../../shared/Text/AdminText'

const SellerProfile = () => {
  // Fake seller data (buraya apiden veri çekebilirsin veya props ile gönderebilirsin)
  const seller = {
    profileImage: "https://ui-avatars.com/api/?name=Ali+Veli", // Örnek profil resmi
    name: "Ali",
    lastname: "Veli",
    email: "ali.veli@example.com",
    phoneNumber: "+905551234567",
    companyName: "Veli Ticaret Ltd. Şti.",
    taxId: "1234567890"
  };

  const boxStyle = 'border border-gray-200 p-6 rounded-lg shadow bg-white';
  const labelStyle = 'block text-sm font-medium text-gray-900 pb-1';
  const valueStyle = 'text-gray-800 text-base mb-2';
  const buttonStyle = "bg-[var(--color-orange)] text-white px-4 py-2 rounded-lg font-semibold";
  const inputStyle = 'w-full border-gray-200 outline-none border px-3 py-2 rounded-lg mb-3 bg-gray-50';

  return (
    <div className='min-h-screen py-8 px-4 bg-[var(--color-light)]'>
      <div className='max-w-3xl mx-auto'>
        <AdminText>Satıcı Profili</AdminText>
        <div className={boxStyle + ' mt-6 flex flex-col items-center'}>
          <div className="mb-6">
            <img
              src={seller.profileImage}
              alt="Profil"
              className="rounded-full w-28 h-28 object-cover border-4 border-[var(--color-orange)] shadow"
            />
          </div>
          <form className="w-full grid md:grid-cols-2 gap-6">
            {/* Sol taraf */}
            <div>
              <label className={labelStyle}>Adı</label>
              <input type="text" className={inputStyle} defaultValue={seller.name} />
              
              <label className={labelStyle}>Soyadı</label>
              <input type="text" className={inputStyle} defaultValue={seller.lastname} />

              <label className={labelStyle}>E-posta</label>
              <input type="email" className={inputStyle} defaultValue={seller.email} />
              
              <label className={labelStyle}>Telefon Numarası</label>
              <input type="text" className={inputStyle} defaultValue={seller.phoneNumber} />
            </div>
            {/* Sağ taraf */}
            <div>
              <label className={labelStyle}>Firma Adı</label>
              <input type="text" className={inputStyle} defaultValue={seller.companyName} />

              <label className={labelStyle}>Vergi Numarası</label>
              <input type="text" className={inputStyle} defaultValue={seller.taxId} />

              {/* Şifre gibi alanları buraya eklemiyoruz (güvenlik) */}
            </div>
          </form>
          {/* Butonlar */}
          <div className="mt-8 flex gap-4">
            <button type="submit" className={buttonStyle}>
              Bilgileri Kaydet
            </button>
            <button type="button" className={buttonStyle + " bg-gray-500 hover:bg-gray-600"}>
              Düzenlemeyi İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
