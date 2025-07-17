import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import GrayButton from '../../../shared/Button/GrayButton';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { IoArrowBack } from 'react-icons/io5';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
    });
    const [isPhoneReset, setIsPhoneReset] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState('request'); // 'request', 'verification', 'reset'
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setSuccessMessage('');
    };

    const handleVerificationCodeChange = (e) => {
        setVerificationCode(e.target.value);
        setErrors((prev) => ({ ...prev, code: '' }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const toggleResetMethod = () => {
        setIsPhoneReset((prev) => !prev);
        setFormData({ email: '', phone: '' });
        setErrors({});
        setSuccessMessage('');
    };

    const handleBackToLogin = () => {
        navigate('/auth/login');
    };

    const validateStep1 = () => {
        const newErrors = {};
        
        if (isPhoneReset) {
            if (!formData.phone) {
                newErrors.phone = 'Telefon numarası gereklidir';
            } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Geçerli bir telefon numarası giriniz';
            }
        } else {
            if (!formData.email) {
                newErrors.email = 'E-posta adresi gereklidir';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Geçerli bir e-posta adresi giriniz';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        
        if (!verificationCode) {
            newErrors.code = 'Doğrulama kodu gereklidir';
        } else if (verificationCode.length !== 6) {
            newErrors.code = 'Doğrulama kodu 6 haneli olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors = {};
        
        if (!newPassword) {
            newErrors.newPassword = 'Yeni şifre gereklidir';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Şifre en az 6 karakter olmalıdır';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        
        if (!validateStep1()) return;

        setIsLoading(true);
        setErrors({});

        try {
            // API çağrısı simülasyonu
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const resetMethod = isPhoneReset ? 'telefon numarası' : 'e-posta adresi';
            setSuccessMessage(`Şifre sıfırlama kodu ${resetMethod}nıza gönderildi.`);
            setStep('verification');
        } catch (error) {
            setErrors({ general: 'Şifre sıfırlama isteği gönderilemedi. Lütfen tekrar deneyin.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        
        if (!validateStep2()) return;

        setIsLoading(true);
        setErrors({});

        try {
            // API çağrısı simülasyonu
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccessMessage('Doğrulama başarılı! Yeni şifrenizi belirleyebilirsiniz.');
            setStep('reset');
        } catch (error) {
            setErrors({ code: 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (!validateStep3()) return;

        setIsLoading(true);
        setErrors({});

        try {
            // API çağrısı simülasyonu
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSuccessMessage('Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...');
            
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);
        } catch (error) {
            setErrors({ general: 'Şifre güncellenemedi. Lütfen tekrar deneyin.' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderRequestStep = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Şifremi Unuttum</h2>
                <p className="text-gray-600 text-sm">
                    {isPhoneReset 
                        ? 'Telefon numaranızı girin, size doğrulama kodu gönderelim' 
                        : 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim'
                    }
                </p>
            </div>

            {errors.general && (
                <div className="text-red-500 text-sm mb-4 text-center">{errors.general}</div>
            )}

            {successMessage && (
                <div className="text-green-600 text-sm mb-4 text-center">{successMessage}</div>
            )}

            {isPhoneReset ? (
                <>
                    <Input 
                        type="tel" 
                        placeholder="Telefon Numarası" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                </>
            ) : (
                <>
                    <Input 
                        type="email" 
                        placeholder="E-posta adresi" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </>
            )}

            <OrangeButton 
                type="submit" 
                onClick={handleRequestReset}
                disabled={isLoading}
            >
                {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Kodu Gönder'}
            </OrangeButton>

        
        </>
    );

    const renderVerificationStep = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Doğrulama Kodu</h2>
                <p className="text-gray-600 text-sm">
                    {isPhoneReset 
                        ? `${formData.phone} numarasına gönderilen 6 haneli kodu girin`
                        : `${formData.email} adresine gönderilen doğrulama kodunu girin`
                    }
                </p>
            </div>

            {errors.code && (
                <div className="text-red-500 text-sm mb-4 text-center">{errors.code}</div>
            )}

            {successMessage && (
                <div className="text-green-600 text-sm mb-4 text-center">{successMessage}</div>
            )}

            <Input 
                type="text" 
                placeholder="6 haneli doğrulama kodu" 
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                maxLength={6}
            />

            <OrangeButton 
                type="submit" 
                onClick={handleVerifyCode}
                disabled={isLoading}
            >
                {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
            </OrangeButton>

        </>
    );

    const renderResetStep = () => (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Yeni Şifre</h2>
                <p className="text-gray-600 text-sm">
                    Yeni şifrenizi belirleyin
                </p>
            </div>

            {errors.general && (
                <div className="text-red-500 text-sm mb-4 text-center">{errors.general}</div>
            )}

            {successMessage && (
                <div className="text-green-600 text-sm mb-4 text-center">{successMessage}</div>
            )}

            <Input 
                type="password" 
                placeholder="Yeni şifre" 
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
            />
            {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}

            <Input 
                type="password" 
                placeholder="Yeni şifre tekrar" 
                name="confirmPassword"
                value={confirmPassword}
                onChange={handlePasswordChange}
                className="mt-4"
            />
            {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}

            <OrangeButton 
                type="submit" 
                onClick={handleResetPassword}
                disabled={isLoading}
            >
                {isLoading ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
            </OrangeButton>
        </>
    );

    return (
        <AuthLayout>
            <form className="space-y-6 flex flex-col p-4 mt-8">

                {step === 'request' && renderRequestStep()}
                {step === 'verification' && renderVerificationStep()}
                {step === 'reset' && renderResetStep()}

                <div className="text-center text-xs text-green-600 mt-6">
                    Güvenli şifre sıfırlama
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;