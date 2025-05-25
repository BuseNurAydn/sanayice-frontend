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

const Login = () => {


    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [isPhoneLogin, setIsPhoneLogin] = useState(false);

    const toggleLoginMethod = () => setIsPhoneLogin((prev) => !prev);


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Giriş başarısız!');
                return;
            }
            const data = await response.json();
            console.log(data);

            // Kullanıcı ve token bilgilerini redux store'a gönder
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

            //Role göre yönlendirme
            if (data.roles[0] == 'ROLE_SELLER') {
                navigate('/seller/dashboard');
                console.log('seller')
            } else if (data.roles[0] == 'ROLE_CUSTOMER') {
                navigate('/');
            }
            else {
                navigate('/seller/categories')
            }
            alert('Giriş başarılı!');
        } catch (error) {
            console.error('Login error:', error);
            alert('Sunucu hatası. Giriş yapılamadı.');
        }
    };
    const renderEmailLogin = () => (
        <>
            {/* E-Posta Girişi */}
            <Input type="email" placeholder="E-posta adresi" name="email" value={loginData.email} onChange={handleInputChange} />
            <Input type="password" placeholder="Şifre" className="mt-4" name="password" value={loginData.password}
                onChange={handleInputChange} />

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
