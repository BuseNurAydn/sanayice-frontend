import { useState, useEffect } from 'react';
import { HiOutlineReply } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { fetchAddresses } from "../../services/addressService"; // API'den adresleri çeken servis
import { fetchCart } from "../../services/cartService"; // API'den sepeti çeken servis
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { MdSmartphone } from "react-icons/md";
import { makePayment } from '../../services/paymentService';

// Fiyat formatlama fonksiyonu
const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '0.00';
  return price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// --- MODAL: Adres Seçim ---
const AddressModal = ({ type, currentAddressId, addresses, onClose, onSelectAddress }) => {

  const addressLabel = (addr) => `${addr.addressTitle} (${addr.district} / ${addr.city} / ${addr.country})`;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
          {type === 'shipping' ? 'Teslimat Adresi Seçimi' : 'Fatura Adresi Seçimi'}
        </h3>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {addresses.length === 0 ? (
            <p className="text-gray-500">Kayıtlı adresiniz bulunmamaktadır. Lütfen yeni bir adres ekleyin.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-3 border rounded-lg cursor-pointer transition 
                                ${addr.id === currentAddressId ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => { onSelectAddress(addr.id); onClose(); }} // ID üzerinden seçim yapıldı
              >
                <p className="font-medium text-gray-800">{addressLabel(addr)}</p>
                <div className='flex items-center text-sm text-gray-600'>
                  <p>{addr.recipientName} </p>
                  <p className='px-2 items-center flex'><MdSmartphone /> {addr.phoneNumber}</p>
                </div>
                <p className="text-base text-gray-800 mt-1">{addr.fullAddress}</p>
              </div>
            ))
          )}
        </div>
        <button
          className="w-full py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg mt-4 hover:bg-gray-300 transition"
          onClick={onClose}
        > Kapat
        </button>
      </div>
    </div>
  );
};
// --- ANA COMPONENT ---
const CheckoutPage = () => {

  // Redux'tan sepet ve kupon verilerini çekme
  const { items: cartItems, subtotal: cartSubtotal, totalDiscount, loading: cartLoading, error: cartError } = useSelector(state => state.cart || {});
  // İlk adresi varsayılan olarak ayarlamak için adres listesini çekme
  const [addresses, setAddresses] = useState([]);

  // İlk Adresin ID'sini veya null'u varsayılan olarak ayarlamak için useEffect kullanıldı.
  const initialShippingAddressId = addresses.length > 0 ? addresses[0].id : null;

  // --- STATE YÖNETİMİ ---
  const [formData, setFormData] = useState({
    // Adres ve Kargo
    selectedAddressId: initialShippingAddressId,
    selectedBillingAddressId: initialShippingAddressId, // Fatura adresi
    isSameAddress: true, // Faturam aynı adrese gönder tiki
    selectedShipping: 'yurtiçi',
    // Ödeme ve Kupon
    isCardSelected: true,
    //selectedInstallment: 1,
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
    is3DSecureChecked: false,
    couponCode: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('shipping'); // 'shipping' veya 'billing'

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- HESAPLAMALAR ---
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0) || 0; // Gerçek sepet toplamı
  const discountAmount = totalDiscount || 0; // Redux'tan gelen toplam indirim
//  const selectedShippingOption = shippingOptions.find(o => o.id === formData.selectedShipping);
 // const shippingPrice = selectedShippingOption?.price || 0;
  const finalTotal = subtotal - discountAmount;

  // --- ADRES VERİSİ YÖNETİMİ (AddressModal için) ---
  const selectedShippingAddress = addresses.find(addr => addr.id === formData.selectedAddressId) || null;
  const selectedBillingAddress = formData.isSameAddress
    ? selectedShippingAddress
    : (addresses.find(addr => addr.id === formData.selectedBillingAddressId) || null);

  const addressLabel = (addr) => addr ? `${addr.addressTitle} (${addr.district} / ${addr.city} / ${addr.country})` : "Adres Seçiniz";

  // --- MODAL FONKSİYONLARI ---
  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  // ID bazında adres seçimi
  const handleSelectAddress = (newAddressId) => {
    if (modalType === 'shipping') {
      setFormData(prev => ({ ...prev, selectedAddressId: newAddressId }));
    } else {
      setFormData(prev => ({ ...prev, selectedBillingAddressId: newAddressId }));
    }
  };

  const handleBackToCart = () => {
    navigate('/sepetim')
  };

  // --- API/REDUX VERİ ÇEKME USEFFECTS ---
  {/** 
  // 1. Sepet verilerini çekme
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);*/}

  // 1. Sepet verilerini çekme
  useEffect(() => {
    console.log(" Sepet verileri çekme işlemi başlatılıyor.");

    dispatch(fetchCart())
      .unwrap() // createAsyncThunk sonucu ile çalışıyorsanız
      .then((result) => {
        // Başarıyla tamamlandığında
        console.log("Sepet verileri başarıyla çekildi.");
        console.log("Gelen veri:", result); // API'den dönen veri
      })
      .catch((error) => {
        // Hata oluştuğunda
        console.error("Sepet verileri çekilirken HATA oluştu:", error);
      });

  }, [dispatch]);
  // 2. Adres verilerini çekme ve ilk adresi varsayılan olarak ayarlama
  useEffect(() => {
    const getAddresses = async () => {
      try {
        const data = await fetchAddresses();
        setAddresses(data);

        // Eğer adresler varsa ve henüz bir adres seçilmemişse ilk adresi varsayılan yap.
        if (data.length > 0 && formData.selectedAddressId === null) {
          setFormData(prev => ({
            ...prev,
            selectedAddressId: data[0].id,
            selectedBillingAddressId: data[0].id,
          }));
        }
      } catch (error) {
        toast.error("Adresler yüklenemedi: " + error.message);
      }
    };

    getAddresses();
  }, [formData.selectedAddressId]); // İlk yüklemede ve adresler değiştiğinde çalışır

  //Ödeme
  const handlePayment = async () => {
    try {
      if (!formData.cardNumber || !formData.expireMonth || !formData.expireYear || !formData.cvc) {
        toast.error("Lütfen kart bilgilerini doldurun.");
        return;
      }

      if (!selectedShippingAddress) {
        toast.error("Teslimat adresi seçmediniz.");
        return;
      }

      const paymentPayload = {
        price: finalTotal.toFixed(2),
        paidPrice: finalTotal.toFixed(2),
        currency: "TRY",
        paymentGroup: "PRODUCT",
        paymentChannel: "WEB",
        customerId: cart.userId?.toString(),   // userId'den geliyor
        basketId: cart.id?.toString(),

        paymentCard: {
          cardHolderName: formData.cardHolderName,
          cardNumber: formData.cardNumber,
          expireMonth: formData.expireMonth,
          expireYear: formData.expireYear,
          cvc: formData.cvc,
          registerCard: 0,
        },
        buyer: {
          id: selectedShippingAddress.id,
          name: selectedShippingAddress.recipientName,
          surname: selectedShippingAddress.recipientName,
          gsmNumber: selectedShippingAddress.phoneNumber,
          email: "example@mail.com",
          identityNumber: "11111111111",
          registrationAddress: selectedShippingAddress.fullAddress,
          city: selectedShippingAddress.city,
          country: selectedShippingAddress.country,
          ip: "85.34.78.112"
        },
        shippingAddress: {
          address: selectedShippingAddress.fullAddress,
          contactName: selectedShippingAddress.recipientName,
          city: selectedShippingAddress.city,
          country: selectedShippingAddress.country,
          zipCode: selectedShippingAddress.postalCode
        },
        billingAddress: {
          address: selectedBillingAddress.fullAddress,
          contactName: selectedBillingAddress.recipientName,
          city: selectedBillingAddress.city,
          country: selectedBillingAddress.country,
          zipCode: selectedBillingAddress.postalCode
        },
        basketItems: cart.items.map((item) => ({
          id: item.productId.toString(),
          name: item.productName,
          //  category1: item.productBrand",
          itemType: "PHYSICAL",
          price: item.totalPrice.toFixed(2)
        }))
      };

      const response = await makePayment(paymentPayload);

      if (response?.status === "success") {
        // 3D Secure ise HTML page gelecek
        if (response?.threeDSHtml) {
          const newWindow = window.open("", "_self");
          newWindow.document.write(response.threeDSHtml);
        } else {
          toast.success("Ödeme başarılı!");
          navigate("/siparis-tamamlandi");
        }
      } else {
        toast.error("Ödeme başarısız: " + response?.errorMessage);
      }

    } catch (err) {
      toast.error("Ödeme hatası: " + err.message);
    }
  };


  // ## 1. TESLİMAT ADRESİ ADIMI
  const renderAddressStep = () => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        {/* SVG Ikonu (Adres) */}
        <span className="text-orange-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
        </span>
        Teslimat Adresi
      </h3>

      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
        {/* Teslimat Adresi Kutusu */}
        <div className={`w-full ${formData.isSameAddress ? 'lg:w-full' : 'lg:w-1/2'} transition-all duration-300`}>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Teslimat Adresi</h4>
          <div className="border border-orange-500 p-3 rounded-lg bg-orange-50 flex justify-between items-center text-xs shadow-sm h-full">
            <div className='flex flex-col'>
              <p className="font-medium text-gray-800 line-clamp-2">{addressLabel(selectedShippingAddress)}</p>
              {selectedShippingAddress && (
                <p className='font-medium text-xs text-gray-600'>{selectedShippingAddress.fullAddress}</p>
              )}
            </div>
            <button
              className="text-orange-500 text-xs font-semibold hover:text-orange-700 whitespace-nowrap ml-3 underline"
              onClick={() => handleOpenModal('shipping')}
            >
              Adresi Değiştir
            </button>

          </div>

        </div>

        {/* Fatura Adresi Kutusu */}
        {!formData.isSameAddress && (
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Fatura Adresi</h4>
            <div className="border border-orange-400 p-3 rounded-lg bg-white flex justify-between items-center text-xs shadow-sm h-full">
              <div className='flex flex-col'>
                <p className="font-medium text-gray-800 line-clamp-2">{addressLabel(selectedBillingAddress)}</p>
                {selectedBillingAddress && (
                  <p className='font-medium text-xs text-gray-600'>{selectedBillingAddress.fullAddress}</p>
                )}
              </div>
              <button
                className="underline text-orange-500 text-xs font-semibold hover:text-orange-700 whitespace-nowrap ml-3"
                onClick={() => handleOpenModal('billing')}
              >
                Adresi Değiştir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fatura Adresi Checkbox */}
      <div className="mt-8">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isSameAddress}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                isSameAddress: e.target.checked,
                // Fatura adresini teslimat adresi ile otomatik eşitle
                selectedBillingAddressId: e.target.checked ? prev.selectedAddressId : prev.selectedBillingAddressId
              }));
            }}
            className="form-checkbox h-4 w-4 text-orange-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700 font-semibold">Faturamı Aynı Adrese Gönder</span>
        </label>
      </div>
    </div>
  );

  // ## 2. ÖDEME SEÇENEKLERİ ADIMI
  const renderPaymentStep = () => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
      {/* ... (Ödeme Seçenekleri Kodu) ... */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-orange-500 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" /></svg>
        </span>
        Ödeme Seçenekleri
      </h3>

      <div className={`border p-4 rounded-lg text-sm transition ${formData.isCardSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
        <p className="font-bold text-gray-800 flex items-center mb-1 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, isCardSelected: !prev.isCardSelected }))}>
          <input type="radio" checked={formData.isCardSelected} readOnly className="form-radio h-4 w-4 text-orange-500 border-gray-300 mr-2" />
          Kart İle Öde
        </p>
        <p className="text-xs text-gray-600 ml-6">Banka veya Kredi Kartı kullanarak ödemenizi güvenle yapabilirsiniz.</p>

        {formData.isCardSelected && (
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 mt-4 p-4 border border-gray-300 rounded-lg bg-white">
            {/* Sol Taraf: Kart Bilgileri */}
            <div className="flex-1 max-w-md">
              <h4 className="font-semibold text-sm text-gray-700 mb-3 border-b border-gray-100 pb-2">Kart Bilgileri</h4>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Kart Sahibinin Adı</label>
                <input
                  type="text"
                  placeholder=""
                  maxLength={16}
                  className={`w-full p-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none 
                                    ${formData.cardHolderName ? 'border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                  value={formData.cardHolderName}
                  onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                />
              </div>
              {/* Kart Numarası */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Kart Numarası</label>
                <input
                  type="text"
                  placeholder=""
                  maxLength={16}
                  className={`w-full p-2 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none 
                                    ${formData.cardNumber ? 'border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                />
              </div>

              {/* Son Kullanma Tarihi ve CVC */}
              <div className="grid grid-cols-5 gap-2 items-end">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Son Kullanma Tarihi</label>
                  <div className="flex space-x-1">
                    <select value={formData.expireMonth} onChange={(e) => setFormData(prev => ({ ...prev, expireMonth: e.target.value }))} className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none  bg-white"><option value="">Ay</option>{[...Array(12).keys()].map(i => <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>)}</select>
                    <select value={formData.expireYear} onChange={(e) => setFormData(prev => ({ ...prev, expireYear: e.target.value }))} className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none  bg-white"><option value="">Yıl</option>{[...Array(10).keys()].map(i => <option key={23 + i} value={String(23 + i)}>{String(23 + i)}</option>)}</select>
                  </div>
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 ">CVV</label>
                  <input type="text" maxLength={3} className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none " value={formData.cvc} onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value }))} />
                </div>
              </div>

              {/* 3D Secure Onayı */}
              <div className="mt-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.is3DSecureChecked} onChange={(e) => setFormData(prev => ({ ...prev, is3DSecureChecked: e.target.checked }))} className="form-checkbox h-4 w-4 text-orange-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">3D Secure ile ödeme yapmak istiyorum</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  // ## 4. SİPARİŞ ÖZETİ ADIMI
  const renderOrderSummary = () => (
    <div className="w-full lg:sticky lg:top-8 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Sipariş Özeti</h3>

        {/* Ürün Listesi */}
        <div className="max-h-40 overflow-y-auto mb-4 border-b border-gray-100 pb-2">
          {cartItems.length > 0 ? cartItems.map((item, index) => (
            <div key={index} className="flex justify-between text-xs text-gray-600 py-1">
              <span>{item.quantity} x {item.productName}</span>
              <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)} TL</span>
            </div>
          )) : (
            <p className="text-sm text-gray-500">Sepetinizde ürün bulunmamaktadır.</p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Ara Toplam (Ürünler)</span>
            <span className="font-medium">{formatPrice(subtotal)} TL</span> {/* Gerçek Sepet Toplamı */}
          </div>
          {/** 
          <div className="flex justify-between">
            <span>Kargo Toplam</span>
            <span className="font-medium">{formatPrice(shippingPrice)} TL</span>
          </div>*/}
        </div>

        {/* İndirim */}
        <div className="bg-green-100 p-3 rounded-lg flex justify-between font-bold text-green-700 mt-3">
          <span>İndirim</span>
          <span className="text-lg font-extrabold">- {formatPrice(discountAmount)} TL</span>
        </div>

        {/* Genel Toplam */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold">Toplam</span>
          <span className="text-lg font-semibold text-orange-600">{formatPrice(finalTotal)} TL</span>
        </div>

      </div>
      <div className="p-6 pt-2 mt-4 border-t border-gray-100">
        <h4 className="text-sm font-bold text-gray-800 mb-2">Kupon Kodu</h4>
        <div className="flex gap-2">
          <input
            type="text"
            name="couponCode"
            value={formData.couponCode}
            onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value }))}
            placeholder="Kupon kodu girin"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition text-sm"
          />
          <button
            type="button"
            onClick={() => console.log("Kupon kodu uygulandı")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-150 text-sm"
          >
            Kullan
          </button>
        </div>
      </div>

      {/* Ödeme Yap Butonu ve Yasal Metinler */}
      <div className="p-6 pt-0">
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition duration-150"
        >
          Ödeme Yap
        </button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Ön Bilgilendirme Koşulları'nı okudum ve Mesafeli Satış Sözleşmesi'ni onaylıyorum.
        </p>
      </div>
    </div>
  );
  // ## ANA SAYFA RENDER
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-10">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={handleBackToCart}
          className="text-orange-500 hover:text-orange-600 border border-orange-600 py-1 px-2 hover:bg-orange-100 cursor-pointer flex"
        >
          <HiOutlineReply className="w-5 h-5 mr-2" />
          Sepete Dön
        </button>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-8">

        {/* Sol Taraf: Adımlar */}
        <div className="lg:w-2/3">
          {renderAddressStep()}
          {renderPaymentStep()}
        </div>

        {/* Sağ Taraf: Sipariş Özeti */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          {renderOrderSummary()}
        </div>
      </div>

      {/* Adres Seçim Modalı */}
      {modalOpen && <AddressModal
        type={modalType}
        currentAddressId={modalType === 'shipping' ? formData.selectedAddressId : formData.selectedBillingAddressId}
        addresses={addresses} // Gerçek adresler listesi gönderiliyor
        onClose={() => setModalOpen(false)}
        onSelectAddress={handleSelectAddress}
      />}
    </div>
  );
};
export default CheckoutPage;