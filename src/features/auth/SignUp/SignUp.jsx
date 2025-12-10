import { useState, useEffect } from 'react';
import AuthLayout from '../AuthLayout';
import PasswordInput from '../../../shared/Input/PasswordInput';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import { BsExclamationLg } from "react-icons/bs";
import { BiSolidCoupon } from "react-icons/bi";
import { MdEmail, MdAccessTime, MdOutlineSmartphone } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import {
  registerCustomer, // Kayıt işlemi için
  generateOtp,      // Yeni: /api/otp/generate
  confirmOtp,       // Yeni: /api/otp/confirm
  //verifyEmail
  //resendVerificationCode
} from '../../../services/authService';

const SignUp = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: '',
    role: 'ROLE_CUSTOMER',
    shippingAddress: {
      addressLine: '',
      city: '',
      district: '',
      postalCode: '',
      phone: '', // Adres telefonu için 
    },
    billingAddress: {
      addressLine: '',
      city: '',
      district: '',
      postalCode: '',
      phone: '',
    },
    acceptTerms: false,
    allowMarketing: false,
  });

  // --- 2. SMS Doğrulama State'leri ---
  const [isSmsVerification, setIsSmsVerification] = useState(false); // SMS doğrulama ekranını gösterir
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPendingVerification, setShowPendingVerification] = useState(false);

  // Üyelik sözleşmesi modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const info = 'text-center font-medium custom-font text-[10px] text-black bg-[var(--color-orangeTwo)] opacity-80 rounded-md flex items-center px-1';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Component mount olduğunda bekleyen doğrulama var mı kontrol et
  useEffect(() => {
    const pendingVerification = localStorage.getItem('pendingSmsVerification'); // Key güncellendi
    if (pendingVerification) {
      const verificationData = JSON.parse(pendingVerification);

      const now = new Date().getTime();
      const verificationTime = new Date(verificationData.timestamp).getTime();
      const hoursPassed = (now - verificationTime) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        setFormData(prev => ({
          ...prev,
          email: verificationData.email,
          name: verificationData.name || '',
          lastname: verificationData.lastname || '',
          phoneNumber: verificationData.phoneNumber || prev.phoneNumber
        }));
        setShowPendingVerification(true);
        setMessage('Bekleyen bir hesap aktifleştirme işleminiz bulunmaktadır. SMS doğrulama işlemine devam edebilirsiniz.');
        setMessageType('info');

      } else {
        localStorage.removeItem('pendingSmsVerification'); // Key güncellendi
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, '');

  // Eğer zaten 90 ile başlıyorsa olduğu gibi dön
  if (cleaned.startsWith('90') && cleaned.length === 12) {
    return '+'+cleaned;
  }

  // Eğer 0 ile başlıyorsa 0’ı çöpe at
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Eğer tam 10 hane ise 90 ekle
  if (cleaned.length === 10) {
    return '+90' + cleaned;
  }

  return '+'+cleaned; // fallback
};

const getGsmForBackend = () => {
  let cleaned = formData.phoneNumber.replace(/\D/g, '');

  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (cleaned.startsWith('90')) return cleaned;
  if (cleaned.length === 10) return '90' + cleaned;

  return cleaned;
};

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const savePendingVerification = (email, name, lastname, phoneNumber) => {
    const verificationData = {
      email: email,
      name: name,
      lastname: lastname,
      phoneNumber: phoneNumber,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('pendingSmsVerification', JSON.stringify(verificationData)); // Key güncellendi
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('info');

    if (
      !formData.name ||
      !formData.lastname ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Lütfen tüm alanları doldurun.");
      setMessageType("error");
      return;
    }

    if (!formData.acceptTerms) {
      setMessage("Üyelik sözleşmesini kabul etmeniz gerekmektedir.");
      setMessageType("error");
      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage("Geçerli bir e-posta adresi girin.");
      setMessageType("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Şifreler eşleşmiyor.");
      setMessageType("error");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Şifre en az 6 karakter olmalı.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    const formattedPhone = formatPhoneNumber(formData.phoneNumber);

    const registrationPayload = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      phoneNumber: formattedPhone,
      password: formData.password,
      role: "ROLE_CUSTOMER",
     shippingAddress: { 
        ...formData.shippingAddress,
        phone: formData.shippingAddress.phone || formattedPhone, 
    },
    billingAddress: {
        ...formData.billingAddress,
        phone: formData.billingAddress.phone || formattedPhone,
    },
    };

    try {
      // 1. Kullanıcıyı Kaydet
      await registerCustomer(registrationPayload);
      console.log("Kayıt Başarılı:", registrationPayload);

      // 2. Yeni: Kayıt başarılıysa, hemen OTP Kodu GÖNDERMEK için generateOtp çağırdım
      // Backend'in beklediği 905xx... formatını alıyoruz
      const gsmForOtp = getGsmForBackend();
      console.log("OTP gönderilecek GSM:", gsmForOtp);

      await generateOtp({ gsm: gsmForOtp }); 

      // Bekleyen doğrulama bilgisini kaydet
      savePendingVerification(formData.email, formData.name, formData.lastname, gsmForOtp);

      // Başarılı kayıttan sonra doğrudan SMS doğrulama ekranına geç
      setMessage(`Kayıt başarılı!`);
      setMessageType('success');
      setShowPendingVerification(false);
      setIsSmsVerification(true)
     // setIsRegistered(true);
      startCountdown();

    } catch (error) {
      // Hata oluştuysa, kullanıcıyı kayıt ekranında tut
      setMessage(error.message || 'Kayıt sırasında bir hata oluştu.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

// OTP oluşturma ve yeniden gönderme fonksiyonu
const handleGenerateOtp = async (gsm) => {
  try {
    setMessage('');
    setMessageType('info');
    setIsResending(true);

   const gsmForOtp = getGsmForBackend();
   await generateOtp({ gsm: gsmForOtp });

   console.log(gsmForOtp)
    setMessage('Doğrulama kodu gönderildi.');
    setMessageType('success');

    setIsSmsVerification(true);
    startCountdown();
  } catch (err) {
    setMessage(err?.message || 'Kod gönderilemedi.');
    setMessageType('error');
    throw err;
  } finally {
    setIsResending(false);
  }
};


  // --- 4. SMS Doğrulama İşlemi ---
  const handleVerifySms = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('info');

    if (!verificationCode || verificationCode.length !== 6) {
      setMessage("Lütfen 6 haneli doğrulama kodunu girin.");
      setMessageType("error");
      return;
    }

    setIsVerifying(true);

    try {
      const gsmForOtp = getGsmForBackend();
     
      const verificationData = {
        gsm: gsmForOtp,
        otp: verificationCode
      };

      await confirmOtp(verificationData);

      // Başarılı doğrulama sonrası bekleyen doğrulama bilgisini temizle
      localStorage.removeItem('pendingSmsVerification');

      setMessage('Hesabınız başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...');
      setMessageType('success');

      setTimeout(() => {
        navigate('/giris-kaydol/giris-yap');
      }, 2000);

    } catch (error) {
      setMessage(error.message || 'Doğrulama kodu geçersiz.');
      setMessageType('error');
    } finally {
      setIsVerifying(false);
    }
  };

  // --- 5. Kodu Tekrar Gönderme İşlemi ---
  const handleResendSmsCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setMessage('');

    try {
     const gsmForOtp = getGsmForBackend();

      const resendData = {
        gsm: gsmForOtp
      };

      await generateOtp(resendData);

      setMessage('Doğrulama kodu tekrar gönderildi.');
      setMessageType('success');
      startCountdown();

    } catch (error) {
      setMessage(error.message || 'Kod gönderilirken hata oluştu.');
      setMessageType('error');
    } finally {
      setIsResending(false);
    }
  };

  // Bekleyen doğrulamaya devam et
  const handlePendingVerification = async () => {
    setShowPendingVerification(false);
   // setIsRegistered(true);

     const gsmForOtp = getGsmForBackend();

    try {
      await handleGenerateOtp(gsmForOtp);

      setMessage(`Bekleyen SMS doğrulama işlemine devam ediliyor. Telefon numaranıza yeni bir kod gönderildi, lütfen kodu girin.`);
      setMessageType('info');
      startCountdown();

    } catch (error) {
      setMessage(error.message || 'Kodu tekrar gönderirken bir hata oluştu.');
      setMessageType('error');
    }
  };

  const handleCancelPendingVerification = () => {
    localStorage.removeItem('pendingSmsVerification');
    setShowPendingVerification(false);
    setFormData({
      name: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: '',
      role: 'ROLE_CUSTOMER',
      shippingAddress: '',
      billingAddress: '',
      acceptTerms: false,
      allowMarketing: false,
    });
    setMessage('');
  };

  const handleClick = () => {
    navigate('/giris-kaydol/satici/uye-ol');
  };

  const messageStyles = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-yellow-800"
  };


  // Bekleyen doğrulama uyarısı
  if (showPendingVerification) {
    const target = formData.phoneNumber;
    const targetType = 'numarasına';

    return (
      <AuthLayout>
        <div className="space-y-6 flex flex-col p-6">

          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-300 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-orange-800">
              <MdAccessTime className="w-6 h-6" />

              <div className="font-semibold">Bekleyen SMS Doğrulaması</div>
            </div>

            <div className="text-sm text-orange-700">
              <p className="mb-2">
                <strong>{target}</strong> {targetType} gönderilen doğrulama kodunu henüz onaylamadınız.
              </p>
              <p className="text-xs text-orange-600"> Hesabınızı aktifleştirmek için doğrulama işlemini tamamlamanız gerekiyor.
              </p>
            </div>
          </div>

          {/* Mesaj kutusu */}
          {message && (
            <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
              {message}
            </div>
          )}

          {/* Aksiyon butonları */}
          <div className="space-y-3">
            <OrangeButton
              onClick={handlePendingVerification}
              className="w-full"
            >
              <MdOutlineSmartphone className="w-5 h-5 mr-2" />
              Doğrulama Kodunu Gir
            </OrangeButton>

            <button
              onClick={handleCancelPendingVerification}
              className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Yeni Hesap Oluştur
            </button>
          </div>

          {/* Yardımcı bilgi */}
          <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <IoWarningOutline className="w-4 h-4 mx-auto mb-1" />
            <p>Doğrulama kodu 24 saat geçerlidir.</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // --- 6. SMS Doğrulama Ekranı ---
  if (isSmsVerification) {
    const target = formData.phoneNumber;
    const targetLabel = 'Telefon numaranıza';
    const targetIcon = <MdOutlineSmartphone className="w-6 h-6 flex-shrink-0" />;

    const handleFormSubmit = handleVerifySms;
    const handleResend = handleResendSmsCode;

    return (
      <AuthLayout>
        <div className="space-y-6 flex flex-col p-6">
          {/* mesaj kutusu */}
          {message && (
            <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
              {message}
            </div>
          )}

          {/* Doğrulama bilgi kutusu */}
          <div className={`${info} gap-4 py-3`}>
            {targetIcon}
            <div className="text-center min-w-0 flex-1">
              <div className="mb-1">{targetLabel} doğrulama kodu gönderildi</div>
              <div className="font-bold text-xs break-all">{target}</div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="w-full">
              <Input
                type="text"
                name="verificationCode"
                placeholder="6 haneli kod"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-[0.5em] font-mono w-full px-4 py-3 placeholder:font-sans placeholder:text-gray-400 placeholder:tracking-normal"
              />
            </div>

            <OrangeButton
              type="submit"
              className="w-3/4 mx-auto"
              disabled={isVerifying}
            >
              {isVerifying ? 'Doğrulanıyor...' : 'Kodu Doğrula'}
            </OrangeButton>
          </form>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Kod gelmedi mi?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className={`px-4 py-2 rounded-lg transition-colors ${countdown > 0 || isResending
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-[var(--color-orange)] hover:bg-orange-50 hover:underline'
                }`}
            >
              {isResending
                ? 'Gönderiliyor...'
                : countdown > 0
                  ? `Tekrar gönder (${countdown}s)`
                  : 'Kodu tekrar gönder'
              }
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Normal kayıt formu
  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col px-4 md:px-8 py-8">
        {/* mesaj kutusu */}
        {message && (
          <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
            {message}
          </div>
        )}

        {/* Üst bilgilendirme kutusu */}
        <div className={`${info} gap-20`}> <BiSolidCoupon className="w-6 h-6" /> Yeni Üyelerimize özel kuponlarımızla!
        </div>

        <div className="flex space-x-4">
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Ad"
            onChange={handleChange}
            value={formData.name}
            className="w-1/2"
          />
          <Input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Soyad"
            onChange={handleChange}
            value={formData.lastname}
            className="w-1/2"
          />
        </div>

        <Input
          type="email"
          name="email"
          id="email"
          placeholder="E-posta adresi"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="flex gap-4">
          <Input
            type="text"
            value="TR (+90)"
            disabled
            className="w-1/3"
          />
          <Input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="5xx xxx xx xx"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-2/3"
          />
        </div>

        <div className={`${info} gap-8`}>
          <BsExclamationLg className="w-6 h-6" />
          Telefon numaranı doğrulaman için size **SMS ile** kod göndereceğiz.
        </div>

        {/* Şifre */}
        <PasswordInput
          name="password"
          id="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Şifre Tekrar */}
        <PasswordInput
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Şifreyi Tekrar Girin"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div className="space-y-4 text-xs text-[var(--color-dark-blue)] custom-font">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="accent-[var(--color-dark-orange)]"
            />
            <span>
              <span
                className="text-[var(--color-light-orange)] cursor-pointer hover:underline"
                onClick={openModal}
              > Üyelik Sözleşmesini
              </span> okudum, anladım ve kabul ediyorum.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="allowMarketing"
              id="allowMarketing"
              checked={formData.allowMarketing}
              onChange={handleChange}
              className="accent-[var(--color-dark-orange)] mt-1"
            />
            <span>Kampanyalardan haberdar olmak istiyorum.</span>
          </label>
        </div>

        <OrangeButton
          type="submit"
          className="w-3/4 mx-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Üye Ol'}
        </OrangeButton>
      </form>

      <div
        onClick={handleClick}
        className="w-full text-center text-sm text-white bg-[var(--color-dark-orange)] font-semibold p-3 custom-font rounded-b-lg mt-6 cursor-pointer"
      >
        Ürünlerini pazarlamaya ne dersin?<br />
        O zaman sen de bize katıl.
      </div>

      {/* Üyelik Sözleşmesi Modal*/}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-25 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-2xl font-semibold">Üyelik Sözleşmesi</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto space-y-6 text-sm leading-relaxed">
              <h3 className="font-bold text-lg">ÜYE KULLANICI SÖZLEŞMESİ</h3>
              {/* Sözleşme içeriği aynı kalır */}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
export default SignUp;