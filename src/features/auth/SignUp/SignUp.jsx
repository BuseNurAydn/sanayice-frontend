// SignUp.jsx - Geliştirilmiş versiyon

import { useState, useEffect } from 'react';
import AuthLayout from '../AuthLayout';
import { Link } from 'react-router-dom';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import { BsExclamationLg } from "react-icons/bs";
import { BiSolidCoupon } from "react-icons/bi";
import { MdEmail, MdAccessTime } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { registerCustomer, verifyEmail, resendVerificationCode } from '../../../services/authService';

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
    shippingAddress: '',
    billingAddress: '',
  });

  // Email doğrulama state'leri
  const [isRegistered, setIsRegistered] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPendingVerification, setShowPendingVerification] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const info = 'text-center font-medium custom-font text-[10px] text-black bg-[var(--color-orange)] opacity-80 rounded-lg flex items-center px-1';

  // Component mount olduğunda bekleyen doğrulama var mı kontrol et
  useEffect(() => {
    const pendingVerification = localStorage.getItem('pendingEmailVerification');
    if (pendingVerification) {
      const verificationData = JSON.parse(pendingVerification);
      
      // Eğer verificationData varsa ve 24 saat geçmemişse
      const now = new Date().getTime();
      const verificationTime = new Date(verificationData.timestamp).getTime();
      const hoursPassed = (now - verificationTime) / (1000 * 60 * 60);
      
      if (hoursPassed < 24) {
        setFormData(prev => ({
          ...prev,
          email: verificationData.email,
          name: verificationData.name || '',
          lastname: verificationData.lastname || ''
        }));
        setShowPendingVerification(true);
        setMessage(`${verificationData.email} adresine gönderilen doğrulama kodunu tamamlayın.`);
        setMessageType('info');
      } else {
        // 24 saat geçmişse temizle
        localStorage.removeItem('pendingEmailVerification');
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
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    return '+90' + cleaned;
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

  const savePendingVerification = (email, name, lastname) => {
    const verificationData = {
      email: email,
      name: name,
      lastname: lastname,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('pendingEmailVerification', JSON.stringify(verificationData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('info');

    // Zorunlu alan kontrolü
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

    // E-posta doğrulama
    if (!validateEmail(formData.email)) {
      setMessage("Geçerli bir e-posta adresi girin.");
      setMessageType("error");
      return;
    }

    // Telefon numarası uzunluğu kontrolü
    const formattedPhone = formatPhoneNumber(formData.phoneNumber);
    if (formattedPhone.length !== 13) {
      setMessage("Geçerli bir telefon numarası girin.");
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

    const payload = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      phoneNumber: formatPhoneNumber(formData.phoneNumber),
      password: formData.password,
      role: "ROLE_CUSTOMER",
      shippingAddress: "",
      billingAddress: ""
    };

    try {
      const data = await registerCustomer(payload);

      // Bekleyen doğrulama bilgisini kaydet
      savePendingVerification(formData.email, formData.name, formData.lastname);

      setMessage('Kayıt başarılı! E-posta adresinize doğrulama kodu gönderildi.');
      setMessageType('success');
      setIsRegistered(true);
      setShowPendingVerification(false);
      startCountdown();

    } catch (error) {
      setMessage(error.message || 'İstek gönderilirken bir hata oluştu.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (e) => {
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
      const verificationData = {
        email: formData.email,
        verificationCode: verificationCode
      };

      await verifyEmail(verificationData);

      // Başarılı doğrulama sonrası bekleyen doğrulama bilgisini temizle
      localStorage.removeItem('pendingEmailVerification');

      setMessage('E-posta başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...');
      setMessageType('success');

      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);

    } catch (error) {
      setMessage(error.message || 'Doğrulama kodu geçersiz.');
      setMessageType('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setMessage('');

    try {
      const resendData = {
        email: formData.email
      };

      await resendVerificationCode(resendData);

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

  const handlePendingVerification = () => {
    setShowPendingVerification(false);
    setIsRegistered(true);
    setMessage('E-posta doğrulamasını tamamlayın.');
    setMessageType('info');
  };

  const handleCancelPendingVerification = () => {
    localStorage.removeItem('pendingEmailVerification');
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
    });
    setMessage('');
  };

  const handleClick = () => {
    navigate('/auth/signUp/seller');
  };

  const messageStyles = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-yellow-800"
  };

  // Bekleyen doğrulama uyarısı
  if (showPendingVerification) {
    return (
      <AuthLayout>
        <div className="space-y-6 flex flex-col p-6">
          {/* Bekleyen doğrulama uyarı kutusu */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-300 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-orange-800">
              <MdAccessTime className="w-6 h-6" />
              <div className="font-semibold">Bekleyen E-posta Doğrulaması</div>
            </div>
            
            <div className="text-sm text-orange-700">
              <p className="mb-2">
                <strong>{formData.email}</strong> adresine gönderilen doğrulama kodunu henüz onaylamadınız.
              </p>
              <p className="text-xs text-orange-600">
                Hesabınızı aktifleştirmek için doğrulama işlemini tamamlamanız gerekiyor.
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
              <MdEmail className="w-5 h-5 mr-2" />
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
            <p>Doğrulama kodu 24 saat geçerlidir. Kod gelmedi mi?</p>
            <p>Spam klasörünüzü kontrol edin.</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Email doğrulama ekranı
  if (isRegistered) {
    return (
      <AuthLayout>
        <div className="space-y-6 flex flex-col p-6">
          {/* mesaj kutusu */}
          {message && (
            <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
              {message}
            </div>
          )}

          {/* Email doğrulama bilgi kutusu */}
          <div className={`${info} gap-4 py-3`}>
            <MdEmail className="w-6 h-6 flex-shrink-0" />
            <div className="text-center min-w-0 flex-1">
              <div className="mb-1">E-posta adresinize doğrulama kodu gönderildi</div>
              <div className="font-bold text-xs break-all">{formData.email}</div>
            </div>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-4">
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
              {isVerifying ? 'Doğrulanıyor...' : 'E-postayı Doğrula'}
            </OrangeButton>
          </form>

          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Kod gelmedi mi?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || isResending}
              className={`px-4 py-2 rounded-lg transition-colors ${
                countdown > 0 || isResending
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

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistered(false);
                setVerificationCode('');
                setMessage('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Geri dön
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Normal kayıt formu
  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col p-6">
        {/* mesaj kutusu */}
        {message && (
          <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
            {message}
          </div>
        )}

        {/* Üst bilgilendirme kutusu */}
        <div className={`${info} gap-20`}>
          <BiSolidCoupon className="w-6 h-6" />
          Yeni Üyelerimize özel kuponlarımızla!
        </div>

        <div className="flex space-x-8">
          <Input 
            type="text" 
            name="name" 
            placeholder="Ad" 
            onChange={handleChange} 
            value={formData.name} 
            className="w-1/2" 
          />
          <Input 
            type="text" 
            name="lastname" 
            placeholder="Soyad" 
            onChange={handleChange} 
            value={formData.lastname} 
            className="w-1/2" 
          />
        </div>

        <Input 
          type="email" 
          name="email" 
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
            placeholder="Telefon Numarası" 
            value={formData.phoneNumber} 
            onChange={handleChange} 
            className="w-2/3" 
          />
        </div>

        <div className={`${info} gap-8`}>
          <BsExclamationLg className="w-6 h-6" />
          E-posta adresinizi doğrulaman için size kod göndereceğiz.
        </div>

        <Input 
          type="password" 
          name="password" 
          placeholder="Şifre" 
          value={formData.password} 
          onChange={handleChange} 
        />

        <Input 
          type="password" 
          name="confirmPassword" 
          placeholder="Şifreyi Tekrar Girin"
          value={formData.confirmPassword} 
          onChange={handleChange} 
        />

        <div className="space-y-4 text-sm text-[var(--color-dark-blue)] font-medium custom-font">
          <label className="flex items-start gap-2">
            <input 
              type="checkbox" 
              name="acceptTerms" 
              onChange={handleChange} 
              className="accent-[var(--color-dark-orange)] mt-1" 
            />
            <span>
              <Link className="text-[var(--color-orange)]" to="#"> Üyelik Sözleşmesini </Link>
              okudum ve kabul ediyorum.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input 
              type="checkbox" 
              name="allowMarketing" 
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
        className="w-full text-center text-base text-white bg-[var(--color-dark-orange)] font-bold p-3 custom-font rounded-b-[2rem] mt-6 cursor-pointer"
      >
        Ürünlerini pazarlamaya ne dersin?<br />
        O zaman sen de bize katıl.
      </div>
    </AuthLayout>
  );
};

export default SignUp;