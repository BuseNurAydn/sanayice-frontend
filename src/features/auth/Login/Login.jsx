import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from '../AuthLayout';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import PasswordInput from '../../../shared/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setSuccessMessage('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await login(loginData);

            // Yanlış sayfadan giriş yapma kontrolü
            if (data.roles[0] === 'ROLE_SELLER') {
                toast.error('Satıcılar lütfen satıcı giriş sayfasını kullanın!');

                setLoginData({
                    email: '',
                    password: '',
                });

                setErrors({});
                setSuccessMessage('');

                return; // login işlemini durdur
            }

            // Başarı mesajı
            setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
            setErrors({});

            // Redux ve localStorage kaydı
            dispatch(setCredentials({
                user: {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    role: data.roles[0]
                },
                token: data.token,
            }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                email: data.email,
                name: data.name,
                role: data.roles[0],
            }));

            setTimeout(() => {
                //Role göre yönlendirme 
                if (data.roles[0] == 'ROLE_CUSTOMER') {
                    navigate('/');
                }
                else {
                    navigate('/satici/kategoriler')
                }
            }, 1500); // 1.5 saniye bekleyip yönlendir

        } catch (error) {
            if (error.errors) setErrors(error.errors);
            else setErrors({ general: error.message || 'Giriş başarısız!' });
        }
    };

    return (
        <AuthLayout>
            <form className="space-y-6 flex flex-col px-4 md:px-8 py-4 mt-8">
                {/* Genel hata */}
                {errors.general && (
                    <div className="text-red-500 text-sm mb-2">{errors.general}</div>
                )}

                {/* Başarı mesajı */}
                {successMessage && (
                    <div className="text-green-600 text-sm mb-2">{successMessage}</div>
                )}

                {/* E-Posta */}
                <Input
                    type="email"
                    placeholder="E-posta adresi"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                {/* Şifre */}
                <PasswordInput
                    name="password"
                    placeholder="Şifre"
                    value={loginData.password}
                    onChange={handleChange}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

                <Link to="/giris-kaydol/sifremiunuttum" className="custom-font font-medium text-sm text-[var(--color-light-orange)]">
                    Şifremi Unuttum
                </Link>

                {/* Giriş Butonu */}
                <OrangeButton type="button" onClick={handleLogin}>Giriş Yap</OrangeButton>

                <div className="text-center text-xs text-green-600">
                    Güvenli alışveriş
                </div>

                <Link to="/giris-kaydol/satici/giris-yap" className="flex justify-center text-orange-600 underline">
                    Satıcı girişi için tıklayınız
                </Link>
            </form>

            <ToastContainer position="top-right" autoClose={3000} />
        </AuthLayout>
    );
};

export default Login;
