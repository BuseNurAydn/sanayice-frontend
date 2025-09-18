import { useState, useEffect } from 'react';
import AuthLayout from '../AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import { BsExclamationLg } from "react-icons/bs";
import { MdEmail, MdAccessTime } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import PasswordInput from "../../../shared/Input/PasswordInput";
import { registerSeller, verifyEmail, resendVerificationCode } from '../../../services/authService';

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const info = 'text-center font-medium custom-font text-[10px] text-black bg-[var(--color-orange)] opacity-80 rounded-lg flex items-center px-1';

    // Form state
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
        shippingAddress: '',
        billingAddress: '',
        acceptTerms: false,
        allowMarketing: false,
    });

    // Email doğrulama state'leri
    const [isRegistered, setIsRegistered] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showPendingVerification, setShowPendingVerification] = useState(false);

    // Üyelik sözleşmesi modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Component mount olduğunda bekleyen satıcı doğrulaması var mı kontrol et
    useEffect(() => {
        const pendingVerification = localStorage.getItem('pendingSellerEmailVerification');
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
                    lastname: verificationData.lastname || '',
                    companyName: verificationData.companyName || '',
                    taxId: verificationData.taxId || ''
                }));
                setShowPendingVerification(true);
                setMessage(`${verificationData.email} adresine gönderilen doğrulama kodunu tamamlayın.`);
                setMessageType('info');
            } else {
                // 24 saat geçmişse temizle
                localStorage.removeItem('pendingSellerEmailVerification');
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

    const savePendingVerification = (email, name, lastname, companyName, taxId) => {
        const verificationData = {
            email: email,
            name: name,
            lastname: lastname,
            companyName: companyName,
            taxId: taxId,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('pendingSellerEmailVerification', JSON.stringify(verificationData));
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
            role: "ROLE_SELLER",
            companyName: formData.companyName,
            taxId: formData.taxId,
            shippingAddress: "",
            billingAddress: "",
        };

        try {
            const data = await registerSeller(payload);

            // Bekleyen doğrulama bilgisini kaydet
            savePendingVerification(
                formData.email,
                formData.name,
                formData.lastname,
                formData.companyName,
                formData.taxId
            );

            setMessage('Satıcı başvurunuz alındı! E-posta adresinize doğrulama kodu gönderildi.');
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
            localStorage.removeItem('pendingSellerEmailVerification');

            setMessage('E-posta başarıyla doğrulandı! Satıcı başvurunuz değerlendirmeye alınacak. Giriş sayfasına yönlendiriliyorsunuz...');
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
        localStorage.removeItem('pendingSellerEmailVerification');
        setShowPendingVerification(false);
        setFormData({
            name: '',
            lastname: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            role: 'ROLE_SELLER',
            companyName: '',
            taxId: '',
            shippingAddress: '',
            billingAddress: '',
            acceptTerms: false,
            allowMarketing: false,
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
        return (
            <AuthLayout>
                <div className="space-y-6 flex flex-col p-6">
                    {/* Bekleyen doğrulama uyarı kutusu */}
                    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-300 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3 text-orange-800">
                            <MdAccessTime className="w-6 h-6" />
                            <div className="font-semibold">Bekleyen Satıcı Doğrulaması</div>
                        </div>

                        <div className="text-sm text-orange-700">
                            <p className="mb-2">
                                <strong>{formData.email}</strong> adresine gönderilen doğrulama kodunu henüz onaylamadınız.
                            </p>
                            <p className="text-xs text-orange-600 mb-2">
                                Firma: <strong>{formData.companyName}</strong> | Vergi No: <strong>{formData.taxId}</strong>
                            </p>
                            <p className="text-xs text-orange-600">
                                Satıcı başvurunuzun değerlendirmeye alınması için doğrulama işlemini tamamlamanız gerekiyor.
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
                            Yeni Satıcı Başvurusu Yap
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
                            <div className="mb-1">Satıcı başvuru doğrulama kodu gönderildi</div>
                            <div className="font-bold text-xs break-all">{formData.email}</div>
                            <div className="text-xs mt-1">{formData.companyName}</div>
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
                            {isVerifying ? 'Doğrulanıyor...' : 'Satıcı Başvurusunu Doğrula'}
                        </OrangeButton>
                    </form>

                    <div className="text-center text-sm text-gray-600">
                        <p className="mb-2">Kod gelmedi mi?</p>
                        <button
                            type="button"
                            onClick={handleResendCode}
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

                    <div className="text-center">

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
                    <Input type="text" name="name" placeholder="Ad" value={formData.name} onChange={handleChange} className="w-1/2" />
                    <Input type="text" name="lastname" placeholder="Soyad" value={formData.lastname} onChange={handleChange} className="w-1/2" />
                </div>

                <Input type="email" name="email" placeholder="E-posta adresi" value={formData.email} onChange={handleChange} />

                <div className="flex gap-4">
                    <Input type="text" value="TR (+90)" disabled className="w-1/3" />
                    <Input type="tel" name="phoneNumber" placeholder="Telefon Numarası" value={formData.phoneNumber} onChange={handleChange} className="w-2/3" />
                </div>

                <div className={`${info} gap-8`}>
                    <BsExclamationLg className="w-6 h-6" />
                    E-posta adresinizi doğrulaman için size kod göndereceğiz.
                </div>

                {/* Şifre */}
                <PasswordInput
                    name="password"
                    placeholder="Şifre"
                    value={formData.password}
                    onChange={handleChange}
                />

                {/* Şifre Tekrar */}
                <PasswordInput
                    name="confirmPassword"
                    placeholder="Şifreyi Tekrar Girin"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <div className="flex space-x-4">
                    <Input type="text" name="companyName" placeholder="Firma Adı" value={formData.companyName} onChange={handleChange} className="w-1/2" />
                    <Input type="text" name="taxId" placeholder="Vergi Numarası" value={formData.taxId} onChange={handleChange} className="w-1/2" />
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
                    {isSubmitting ? 'Gönderiliyor...' : 'Satıcı olmak için başvur'}
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