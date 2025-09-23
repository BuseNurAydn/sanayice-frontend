import { useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../AuthLayout";
import Input from "../../../shared/Input/Input";
import OrangeButton from "../../../shared/Button/OrangeButton";
import PasswordInput from "../../../shared/Input/PasswordInput";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../store/authSlice";
import { login } from "../../../services/authService";
import {toast, ToastContainer} from "react-toastify"

const SellerLogin = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(loginData);

     // Yanlış sayfadan giriş yapma kontrolü
            if (data.roles[0] === 'ROLE_CUSTOMER') {
                toast.error('Lütfen müşteri giriş sayfasını kullanın!');
                
                setLoginData({
                    email: '',
                    password: '',
                });

                setErrors({});
                setSuccessMessage('');

                return; // login işlemini durdur
            }
      // Başarı mesajı
      setSuccessMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
      setErrors({});

      // Redux store’a kaydet
      dispatch(
        setCredentials({
          user: {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.roles[0],
          },
          token: data.token,
        })
      );

      // LocalStorage’a kaydet
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.roles[0],
        })
      );

      setTimeout(() => {
        // Role göre yönlendirme
        if (data.roles[0] === "ROLE_SELLER") {
          navigate("/satici/dogrulama");
        }
      }, 1500);

    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: error.message || "Giriş başarısız!" });
      }
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
          placeholder="Satıcı e-posta adresi"
          name="email"
          value={loginData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

        {/* Şifre */}
        <PasswordInput
          name="password"
          placeholder="Şifre"
          value={loginData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        <Link
          to="/giris-kaydol/satici/sifremiunuttum"
          className="custom-font font-medium text-sm text-[var(--color-light-orange)]"
        >
          Şifremi Unuttum
        </Link>

        <OrangeButton type="submit" onClick={handleLogin}>
          Giriş Yap
        </OrangeButton>

        <div className="text-center text-xs text-green-600">
          Güvenli giriş - Satıcı Paneli
        </div>
          <Link
                to="/giris-kaydol/giris-yap"
                className='flex justify-center text-orange-600 underline'
                >Müşteri girişi için tıklayınız</Link>

      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthLayout>
  );
};

export default SellerLogin;
