import { useState } from 'react';
import AuthLayout from '../AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import { BsExclamationLg } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { registerSeller } from '../../../services/authService';

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
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info"); // "success" | "error"
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const formatPhoneNumber = (phone) => {
        // Tüm boşlukları ve diğer sembolleri kaldır
        let cleaned = phone.replace(/\D/g, '');

        // Eğer numara başında 0 varsa kaldır (ör: 05551234567 -> 5551234567)
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }

        // Ülke kodu ekle
        return '+90' + cleaned;
    };

     const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

         // Şifre eşleşme kontrolü
        if (formData.password !== formData.confirmPassword) {
            setMessage("Şifreler eşleşmiyor.");
            setMessageType("error");
            return;
        };

         // Şifre uzunluğu kontrolü (6 karakter)
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
            shippingAddress: "",  // ya "" ya da null
            billingAddress: "",

        };
        console.log(payload)

        try {  
            const data = await registerSeller(payload);  //servisi kullandık
            
            setMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
            setMessageType('success');

            // 1500 saniye sonra yönlendirme
            setTimeout(() => {
                navigate('/auth/login');
            }, 1500);

            // Redux Toolkit'e token ve kullanıcıyı kaydettim
            dispatch(setCredentials({ token: data.token, user: data.user }));

        } catch (error) {
            setMessage(error.message || 'İstek gönderilirken bir hata oluştu.');
            setMessageType('error');
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
        }
    };
    const messageStyles = {
        success: "text-green-800",
        error: "text-red-800",
        info: "text-yellow-800"
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col p-6">
                {/* mesaj kutusu */}
                {message && (
                    <div className={`text-sm mb-2 ${messageStyles[messageType]}`}>
                        {message}
                    </div>
                )}
                <div className="flex space-x-8">
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
                    Numaranı doğrulaman için SMS ile kod göndereceğiz.
                </div>
                <Input type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleChange} />
                <Input type="password" name="confirmPassword" placeholder="Şifreyi Tekrar Girin"
                    value={formData.confirmPassword} onChange={handleChange}
                />
                <div className="flex space-x-8">
                    <Input type="text" name="companyName" placeholder="Firma Adı" value={formData.companyName} onChange={handleChange} className="w-1/2" />
                    <Input type="text" name="taxId" placeholder="Vergi Numarası" value={formData.taxId} onChange={handleChange} className="w-1/2" />
                </div>

                 <OrangeButton type="submit" className="w-3/4 mx-auto" disabled={isSubmitting}>
                    {isSubmitting ? 'Gönderiliyor...' : 'Satıcı olmak için başvur'}
                </OrangeButton>
            </form>
            <div className="w-full text-center text-base text-white bg-[var(--color-dark-orange)] font-bold p-3 custom-font rounded-b-[2rem] mt-6">
                Ürünlerini pazarlamaya ne dersin?<br />
                O zaman sen de bize katıl.
            </div>
        </AuthLayout>
    );
};
export default SignUp;