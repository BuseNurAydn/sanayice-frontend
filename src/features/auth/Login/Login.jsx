import { useState } from 'react';
import { FaApple, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import AuthLayout from '../AuthLayout';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import GrayButton from '../../../shared/Button/GrayButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { login } from '../../../services/authService';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // Hata temizle
        setSuccessMessage('');
    };

    const toggleLoginMethod = () => setIsPhoneLogin((prev) => !prev);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await login(loginData);
            console.log(data);

            // Giriş başarılı mesajı
            setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
            setErrors({});

            // Kullanıcı ve token bilgilerini redux toolkite'e kaydettim
            dispatch(setCredentials({
                user: {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    role: data.roles[0]  // <--- ilk rolü kullanıyoruz
                },
                token: data.token,
            }));

            localStorage.setItem('token', data.token);
            console.log(data.roles[0]);

            setTimeout(() => {
                //Role göre yönlendirme
                if (data.roles[0] == 'ROLE_SELLER') {
                    navigate('/seller/dashboard');
                } else if (data.roles[0] == 'ROLE_CUSTOMER') {
                    navigate('/');
                }
                else {
                    navigate('/seller/categories')
                }
            }, 1500); // 1.5 saniye bekleyip yönlendir

        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: error.message || 'Giriş başarısız!' });
            }
        }
    };
    const renderEmailLogin = () => (
        <>

            {/* Genel Hata Mesajı */}
            {errors.general && (
                <div className="text-red-500 text-sm mb-2">{errors.general}</div>
            )}

            {/* Başarı mesajı */}
            {successMessage && (
                <div className="text-green-600 text-sm mb-2">{successMessage}</div>
            )}

            {/* E-Posta Girişi */}
            <Input type="email" placeholder="E-posta adresi" name="email" value={loginData.email} onChange={handleInputChange} />
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}

            <Input type="password" placeholder="Şifre" className="mt-4" name="password" value={loginData.password}
                onChange={handleInputChange} />
            {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            <a href="/forgot-password" className="custom-font font-medium text-[var(--color-light-orange)]">
                Şifremi Unuttum
            </a>

            <OrangeButton type="submit" onClick={handleLogin}> Giriş Yap </OrangeButton>

            <GrayButton type="button" onClick={toggleLoginMethod}>
                <BsTelephone className="w-5 h-5" />
                Telefon Numarası ile Giriş Yap
            </GrayButton>
        </>
    );

    const renderPhoneLogin = () => (
        <>
            {/* Telefon Girişi */}
            <Input type="tel" placeholder="Telefon Numarası" />

            <OrangeButton type="submit"> Giriş Yap </OrangeButton>

            <GrayButton type="button" onClick={toggleLoginMethod}>
                <CiMail className="w-5 h-5" />
                E-posta ile Giriş Yap
            </GrayButton>
        </>
    );

    const SocialLogin = () => (
        <div className="mt-6 flex flex-col items-center space-y-4 bg-gray-100 p-4">
            <span className="text-sm text-gray-600">Sosyal hesabın ile giriş yap</span>
            <div className="flex items-center justify-center space-x-4">
                {[<FaApple />, <FcGoogle />, <FaFacebook />].map((Icon, index) => (
                    <div key={index} className="p-2 border border-gray-300 rounded-lg">
                        {Icon}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AuthLayout>
            <form className="space-y-6 flex flex-col p-4 mt-8">
                {isPhoneLogin ? renderPhoneLogin() : renderEmailLogin()}

                <SocialLogin />

                <div className="text-center text-xs text-green-600">Güvenli alışveriş</div>
            </form>
        </AuthLayout>
    );
};
export default Login;
