import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/Login/Login';
import SellerLogin from '../features/auth/Login/SellerLogin';
import SignUp from '../features/auth/SignUp/SignUp';
import SellerSignUp from '../features/auth/SellerSignUp/SignUp'
import ForgotPassword from '../features/auth/ForgotPassword/ForgotPassword';

const AuthRoutes = () => {
  return (
     <Routes>
        <Route path="giris-yap" element={<Login />} />
        <Route path="uye-ol" element={<SignUp />} />
        <Route path='satici/uye-ol' element={<SellerSignUp/>}/>
        <Route path="satici/giris-yap" element={<SellerLogin />} />
        <Route path="sifremiunuttum" element={<ForgotPassword />} />
      </Routes>
  )
}

export default AuthRoutes;
