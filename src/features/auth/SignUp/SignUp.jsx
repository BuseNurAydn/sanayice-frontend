import { useState } from 'react';
import AuthLayout from '../AuthLayout';
import { Link } from 'react-router-dom';
import Input from '../../../shared/Input/Input';
import OrangeButton from '../../../shared/Button/OrangeButton';
import { BsExclamationLg } from "react-icons/bs";
import { BiSolidCoupon } from "react-icons/bi";

const SignUp = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const info = 'text-center font-medium custom-font text-[10px] text-black bg-[var(--color-orange)] opacity-80 rounded-lg flex items-center px-1';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    name: formData.name,
    lastname: formData.lastname,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    password: formData.password,
    role: "ROLE_CUSTOMER",
    shippingAddress: "",  // ya "" ya da null
    billingAddress: ""
  };
  console.log(payload);

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      alert(errorData.message || 'Kayıt sırasında hata oluştu.');
      return;
    }

    alert('Kayıt başarılı!');
  } catch (error) {
    console.error('Fetch error:', error);
    alert('İstek gönderilirken hata oluştu.');
  }
};

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col p-6">
        {/* Üst bilgilendirme kutusu */}
        <div className={`${info} gap-20`}>
          <BiSolidCoupon className="w-6 h-6" />
          Yeni Üyelerimize özel kuponlarımızla!
        </div>
        <div className="flex space-x-8">
          <Input type="text" name="firstName" placeholder="Ad" onChange={handleChange} className="w-1/2" />
          <Input type="text" name="lastName" placeholder="Soyad" onChange={handleChange} className="w-1/2" />
        </div>
        <Input type="email" name="email" placeholder="E-posta adresi" onChange={handleChange} />
        <div className="flex gap-4">
          <Input type="text" value="TR (+90)" disabled className="w-1/3" />
          <Input type="tel" name="phone" placeholder="Telefon Numarası" onChange={handleChange} className="w-2/3" />
        </div>
        <div className={`${info} gap-8`}>
          <BsExclamationLg className="w-6 h-6" />
          Numaranı doğrulaman için SMS ile kod göndereceğiz.
        </div>
        <Input type="password" name="password" placeholder="Şifre" onChange={handleChange} />
        <div className="space-y-4 text-sm text-[var(--color-dark-blue)] font-medium custom-font">
          <label className="flex items-start gap-2">
            <input type="checkbox" name="acceptTerms" onChange={handleChange} className="accent-[var(--color-dark-orange)]  mt-1" />
            <span>
              <Link className="text-[var(--color-orange)]" to="#"> Üyelik Sözleşmesini </Link>
              okudum ve kabul ediyorum.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="allowMarketing" onChange={handleChange} className="accent-[var(--color-dark-orange)]  mt-1" />
            <span>Kampanyalardan haberdar olmak istiyorum.</span>
          </label>
        </div>
        <OrangeButton type="submit" className="w-3/4 mx-auto"> Üye Ol </OrangeButton>
      </form>
      <div className="w-full text-center text-base text-white bg-[var(--color-dark-orange)] font-bold p-3 custom-font rounded-b-[2rem] mt-6">
        Ürünlerini pazarlamaya ne dersin?<br />
        O zaman sen de bize katıl.
      </div>
    </AuthLayout>
  );
};

export default SignUp;
