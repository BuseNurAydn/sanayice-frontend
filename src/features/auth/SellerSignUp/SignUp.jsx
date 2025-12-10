import { useState, useEffect } from 'react';
import AuthLayout from '../AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import { BsExclamationLg } from "react-icons/bs";
import { MdAccessTime, MdOutlineSmartphone } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import PasswordInput from "../../../shared/Input/PasswordInput";
import {
    registerSeller,
    generateOtp,      // POST /api/otp/generate
    confirmOtp,       // POST /api/otp/confirm
} from '../../../services/authService';

const SignUp = () => {
    const navigate = useNavigate();

    const info = 'text-center font-medium custom-font text-[10px] text-black bg-[var(--color-orange)] opacity-80 rounded-lg flex items-center px-1';

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'ROLE_SELLER',
        companyName: '',
        taxId: '',
        acceptTerms: false,
        allowMarketing: false,
    });

    // SMS Doğrulama state'leri
    const [isRegistered, setIsRegistered] = useState(false); // Kayıt başarılı, kod girme ekranını göster
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showPendingVerification, setShowPendingVerification] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Backend'e gönderilecek GSM formatını üretir (örnek: "905301111111")
    const getGsmForBackend = (phone) => {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.startsWith('90')) {
            return cleaned;
        }
        return '90' + cleaned;
    };

    // Kayıt payload'ı için +90'lı telefon formatını üretir (ör: "+905301111111")
    const formatPhoneNumberForPayload = (phone) => {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.startsWith('90')) {
            return '+' + cleaned;
        }
        return '+90' + cleaned;
    };

    // E-posta doğrulama fonksiyonu Form validasyonu için
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Component mount olduğunda bekleyen doğrulama var mı kontrol et
    useEffect(() => {
        // LocalStorage anahtarını sadece SMS odaklı tutuyoruz
        const pendingVerification = localStorage.getItem('pendingSellerSmsVerification');
        if (pendingVerification) {
            const verificationData = JSON.parse(pendingVerification);

            const now = new Date().getTime();
            const verificationTime = new Date(verificationData.timestamp).getTime();
            const hoursPassed = (now - verificationTime) / (1000 * 60 * 60);

            if (hoursPassed < 24) {
                setFormData(prev => ({
                    ...prev,
                    email: verificationData.email || '',
                    name: verificationData.name || '',
                    lastname: verificationData.lastname || '',
                    companyName: verificationData.companyName || '',
                    taxId: verificationData.taxId || '',
                    // LocalStorage'dan gelen numarayı temizle ve sadece son 10 haneyi al (UI için)
                    phoneNumber: verificationData.phoneNumber
                        ? verificationData.phoneNumber.replace(/\D/g, '').slice(-10)
                        : prev.phoneNumber
                }));
                setShowPendingVerification(true);
                setMessage('Bekleyen bir hesap aktifleştirme işleminiz bulunmaktadır.');
                setMessageType('info');
            } else {
                localStorage.removeItem('pendingSellerSmsVerification');
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

    const savePendingVerification = (email, name, lastname, companyName, taxId, phoneNumber) => {
        const verificationData = {
            email: email,  // Email'i kaydet
            name: name,
            lastname: lastname,
            companyName: companyName,
            taxId: taxId,
            phoneNumber: phoneNumber,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem('pendingSellerSmsVerification', JSON.stringify(verificationData));
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
            !formData.confirmPassword ||
            !formData.companyName ||
            !formData.taxId
        ) {
            setMessage("Lütfen tüm alanları doldurun.");
            setMessageType("error");
            return;
        }

        // Üyelik sözleşmesi kontrolü
        if (!formData.acceptTerms) {
            setMessage("Satıcı sözleşmesini kabul etmeniz gerekmektedir.");
            setMessageType("error");
            return;
        }

        // E-posta doğrulama (Kayıt zorunluluğu nedeniyle)
        if (!validateEmail(formData.email)) {
            setMessage("Geçerli bir e-posta adresi girin.");
            setMessageType("error");
            return;
        }

        // Telefon numarası uzunluğu kontrolü
        const formattedPhoneForPayload = formatPhoneNumberForPayload(formData.phoneNumber); // +90'lı format
        const gsmForBackend = getGsmForBackend(formData.phoneNumber); // 90530'lu format

        if (formattedPhoneForPayload.length !== 13) {
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
            phoneNumber: formattedPhoneForPayload,
            password: formData.password,
            role: "ROLE_SELLER",
            companyName: formData.companyName,
            taxId: formData.taxId,

        };

        try {
            // 1. Satıcıyı kaydet (Email zorunlu tutuluyor)
            await registerSeller(payload);
            console.log(payload)

            // 2. E-posta doğrulama adımı atlanıyor, direkt SMS kodu gönderiliyor
            await generateOtp({ gsm: gsmForBackend });

            // Bekleyen doğrulama bilgisini kaydet
            savePendingVerification(
                formData.email,
                formData.name,
                formData.lastname,
                formData.companyName,
                formData.taxId,
                formattedPhoneForPayload
            );

            setMessage(`Satıcı başvurunuz alındı! Lütfen ${formattedPhoneForPayload} numarasına gönderilen SMS kodunu girin.`);
            setMessageType('success');
            setIsRegistered(true); // Direkt kod giriş ekranına geç
            setShowPendingVerification(false);
            startCountdown();

        } catch (error) {
            setMessage(error.message || 'Kayıt sırasında bir hata oluştu.');
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // SADECE SMS Doğrulama Fonksiyonu
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
            const gsmForBackend = getGsmForBackend(formData.phoneNumber);

            const verificationData = {
                gsm: gsmForBackend,
                otp: verificationCode
            };

            await confirmOtp(verificationData);

            localStorage.removeItem('pendingSellerSmsVerification');

            setMessage('Hesabınız başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...');
            setMessageType('success');

            setTimeout(() => {
                navigate('/giris-kaydol/satici/giris-yap');
            }, 2000);

        } catch (error) {
            setMessage(error.message || 'Doğrulama kodu geçersiz.');
            setMessageType('error');
        } finally {
            setIsVerifying(false);
        }
    };

    // Kod tekrar gönderme
    const handleResendCode = async () => {
        if (countdown > 0) return;

        setIsResending(true);
        setMessage('');

        try {
            const gsmForBackend = getGsmForBackend(formData.phoneNumber);

            const resendData = {
                gsm: gsmForBackend
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
        setShowPendingVerification(false); // Bekleyen uyarı ekranını kapattık

        const gsmForOtp = getGsmForBackend(formData.phoneNumber);

        try {
            // API Çağrısı (Kod gönderme)
            await generateOtp({ gsm: gsmForOtp });

            // API başarılıysa, kod girme ekranına geç
            setIsRegistered(true);

            setMessage(`Bekleyen SMS doğrulama işlemine devam ediliyor. Telefon numaranıza yeni bir kod gönderildi, lütfen kodu girin.`);
            setMessageType('info');
            startCountdown();

        } catch (error) {
            // Hata oluşursa isRegistered'ı geri FALSE yap.
            setIsRegistered(false);
            setShowPendingVerification(true);

            setMessage(error.message || 'Kodu tekrar gönderirken bir hata oluştu.');
            setMessageType('error');
        }
    };

    const handleCancelPendingVerification = () => {
        localStorage.removeItem('pendingSellerSmsVerification');
        setShowPendingVerification(false);
        setFormData({
            name: '',
            lastname: '',
            email: '',  // Sıfırlandı
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            role: 'ROLE_SELLER',
            companyName: '',
            taxId: '',
            acceptTerms: false,
        });
        setMessage('');
    };

    const messageStyles = {
        success: "text-green-800",
        error: "text-red-800",
        info: "text-yellow-800"
    };

    // Bekleyen doğrulama uyarısı
    if (showPendingVerification) {
        const title = 'Bekleyen Satıcı SMS Doğrulaması';
        const target = formatPhoneNumberForPayload(formData.phoneNumber);
        const targetType = 'numarasına';
        const buttonIcon = <MdOutlineSmartphone className="w-5 h-5 mr-2" />;

        return (
            <AuthLayout>
                <div className="space-y-6 flex flex-col p-6">
                    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-300 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3 text-orange-800">
                            <MdAccessTime className="w-6 h-6" />
                            <div className="font-semibold">{title}</div>
                        </div>
                        <div className="text-sm text-orange-700">
                            <p className="mb-2">
                                <strong>{target}</strong> {targetType} gönderilen doğrulama kodunu henüz onaylamadınız.
                            </p>
                            <p className="text-xs text-orange-600 mb-2">
                                Firma: <strong>{formData.companyName}</strong> | Vergi No: <strong>{formData.taxId}</strong>
                            </p>
                            <p className="text-xs text-orange-600">
                                Satıcı başvurunuzun değerlendirmeye alınması için doğrulama işlemini tamamlamanız gerekiyor.
                            </p>
                        </div>
                    </div>
                    {message && (
                        <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
                            {message}
                        </div>
                    )}
                    <div className="space-y-3">
                        <OrangeButton
                            onClick={handlePendingVerification}
                            className="w-full"
                        >
                            {buttonIcon}
                            Doğrulama Kodunu Gir
                        </OrangeButton>
                        <button
                            onClick={handleCancelPendingVerification}
                            className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                            Yeni Satıcı Başvurusu Yap
                        </button>
                    </div>
                    <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                        <IoWarningOutline className="w-4 h-4 mx-auto mb-1" />
                        <p>Doğrulama kodu 24 saat geçerlidir. Kod gelmedi mi?</p>
                        <p>Lütfen telefon numaranızı kontrol edin.</p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // Kod Doğrulama ekranı
    if (isRegistered) {
        const target = formatPhoneNumberForPayload(formData.phoneNumber);
        const targetLabel = 'Telefon numaranıza';
        const targetIcon = '📱';
        const handleResend = handleResendCode;
        const handleFormSubmit = handleVerifySms;

        return (
            <AuthLayout>
                <div className="space-y-6 flex flex-col p-6">
                    {/* mesaj kutusu */}
                    {message && (
                        <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
                            {message}
                        </div>
                    )}

                    {/* SMS doğrulama bilgi kutusu */}
                    <div className={`${info} gap-4 py-3`}>
                        <span className="text-lg">{targetIcon}</span>
                        <div className="text-center min-w-0 flex-1">
                            <div className="mb-1">{targetLabel} satıcı başvuru doğrulama kodu gönderildi</div>
                            <div className="font-bold text-xs break-all">{target}</div>
                            <div className="text-xs mt-1">{formData.companyName}</div>
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
                            {isVerifying ? 'Doğrulanıyor...' : 'Satıcı Başvurusunu Doğrula'}
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

    // Normal satıcı kayıt formu
    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col px-4 md:px-8 pt-12 pb-8">
                {/* mesaj kutusu */}
                {message && (
                    <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
                        {message}
                    </div>
                )}

                <div className="flex space-x-4">
                    <Input type="text" id="name" name="name" placeholder="Ad" value={formData.name} onChange={handleChange} className="w-1/2" />
                    <Input type="text" id="lastname" name="lastname" placeholder="Soyad" value={formData.lastname} onChange={handleChange} className="w-1/2" />
                </div>

                {/* E-posta alanı geri geldi */}
                <Input type="email" id="email" name="email" placeholder="E-posta adresi" value={formData.email} onChange={handleChange} />

                <div className="flex gap-4">
                    <Input type="text" value="TR (+90)" disabled className="w-1/3" />
                    <Input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="5XX XXX XX XX"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-2/3"
                        maxLength={10}
                    />
                </div>

                <div className={`${info} gap-8`}>
                    <BsExclamationLg className="w-6 h-6" />
                    Başvurunuzu telefon numaranıza göndereceğimiz **SMS kodu** ile doğrulayacağız.
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

                <div className="flex space-x-4">
                    <Input type="text" id="companyName" name="companyName" placeholder="Firma Adı" value={formData.companyName} onChange={handleChange} className="w-1/2" />
                    <Input type="text" id="taxId" name="taxId" placeholder="Vergi Numarası" value={formData.taxId} onChange={handleChange} className="w-1/2" />
                </div>

                {/* Üyelik Sözleşmesi Checkbox */}
                <div className="flex items-start space-x-2 mt-4">
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="mt-1"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-5">
                        <span
                            className="text-[var(--color-light-orange)] cursor-pointer hover:underline"
                            onClick={openModal}
                        >
                            Satıcı Sözleşmesini
                        </span> okudum, anladım ve kabul ediyorum.
                    </label>
                </div>

                <OrangeButton type="submit" className="w-3/4 mx-auto" disabled={isSubmitting}>
                    {isSubmitting ? 'Başvuruluyor...' : 'Satıcı olmak için başvur'}
                </OrangeButton>
            </form>

            {/* Satıcı Sözleşmesi Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white bg-opacity-25 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h2 className="text-2xl font-semibold">Satıcı Sözleşmesi</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 overflow-y-auto space-y-6 text-sm leading-relaxed">
                            <h3 className="font-bold text-lg">SATICI ÜYELİK SÖZLEŞMESİ</h3>

                            <section className="space-y-3">
                                <h4 className="font-semibold">TARAFLAR</h4>
                                <p>
                                    İşbu Satıcı Kullanıcı Üyelik Sözleşmesi ("Sözleşme"), bir tarafta
                                    FENERBAHÇE MAH. İĞRİP SK. NO: 13 İÇ KAPI NO: 1 KADIKÖY/
                                    İSTANBUL adresinde bulunan ŞAHIS ŞİRKETİMİZ ("Sanayice") ile
                                    diğer tarafta satıcı kullanıcı (Satıcı/Satıcılar) arasında aşağıda belirtilen
                                    şartlar ve hükümler dâhilinde sözleşmenin Satıcı/Satıcılar tarafından
                                    mobil uygulama ve/veya internet sitesi üzerinden Sanayice'nin
                                    sunmuş olduğu işbu sözleşmeyi onaylayarak ve/veya Platformu
                                    indirip kullanarak ve/veya Platform üzerinden işlem yaptığı anda
                                    yürürlüğe girmiştir.
                                </p>
                                <p>
                                    İş bu sözleşme kapsamında Sanayice ve Satıcı ayrı ayrı "Taraf",
                                    birlikte "Taraflar" olarak anılacaktır. İşbu Sözleşme'nin ekleri
                                    ve Sanayice tarafından sunulan hizmetlerinin kullanımına ilişkin
                                    tüm yazılı süreçler, açıklamalar ile ek diğer tüm dokümanlar
                                    Sözleşme'nin ayrılmaz birer parçası kabul edilecektir.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h4 className="font-semibold">TANIMLAR</h4>
                                <p>
                                    <strong>PAZARYERİ:</strong> Sanayice'nin 6563 sayılı Elektronik
                                    Ticaretin Düzenlenmesi Hakkında Kanun uyarınca "elektronik
                                    ticaret aracı hizmet sağlayıcı" ve 5651 sayılı İnternet Ortamında
                                    Yapılan Yayınların Düzenlenmesi modelini ifade eder.
                                </p>
                                <p>
                                    <strong>SATICI:</strong> Platform üzerinde mal ve/veya hizmet
                                    satışı gerçekleştiren, ticari faaliyet gösteren gerçek veya tüzel
                                    kişi üye'yi ifade eder.
                                </p>
                                <p>
                                    <strong>KİŞİSEL VERİ:</strong> 6698 sayılı Kişisel Verilerin
                                    Korunması Kanunu'nda tanımlanan kimliği belirli veya
                                    belirlenebilir kılan gerçek kişiye ilişkin her türlü bilgi
                                    ifade eder.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h4 className="font-semibold">SATICI YÜKÜMLÜLÜKLERİ</h4>
                                <p>
                                    Satıcı, Platform üzerinde satışa sunduğu ürün ve hizmetlerle ilgili olarak:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Doğru, eksiksiz ve güncel bilgi vermekle yükümlüdür.</li>
                                    <li>Yasalara uygun ürün ve hizmet sunmakla yükümlüdür.</li>
                                    <li>Müşteri memnuniyetini sağlamak için gerekli özeni göstermekle yükümlüdür.</li>
                                    <li>Platform kurallarına uymakla yükümlüdür.</li>
                                </ul>
                            </section>

                            <section className="space-y-3">
                                <h4 className="font-semibold">KOMİSYON VE ÖDEME ŞARTLARI</h4>
                                <p>
                                    Satıcı, Platform üzerinden gerçekleştirdiği satışlardan elde ettiği
                                    gelirden belirlenen oranda komisyon ödemeyi kabul eder. Komisyon
                                    oranları ve ödeme şartları Platform tarafından belirlenir ve
                                    değiştirilebilir.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h4 className="font-semibold">HESAP TERMİNİ VE İHLALLER</h4>
                                <p>
                                    Platform, Satıcı'nın sözleşme hükümlerini ihlal etmesi durumunda
                                    hesabını askıya alabilir veya tamamen kapatabilir. Bu durumda
                                    Satıcı'nın herhangi bir tazminat talebi bulunmayacaktır.
                                </p>
                            </section>

                            <section className="space-y-3">
                                <h4 className="font-semibold">UYGULANACAK HUKUK</h4>
                                <p>
                                    İşbu sözleşmeden doğacak her türlü uyuşmazlıkta Türkiye Cumhuriyeti
                                    hukuku uygulanır. Uyuşmazlıklar İstanbul Mahkemeleri ve İcra
                                    Müdürlüklerinin yetkisindedir.
                                </p>
                            </section>
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