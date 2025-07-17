import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/Login/Login';
import SignUp from '../features/auth/SignUp/SignUp';
import SellerSignUp from '../features/auth/SellerSignUp/SignUp'
import ForgotPassword from '../features/auth/ForgotPassword/ForgotPassword';

const AuthRoutes = () => {
  return (
     <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path='signUp/seller' element={<SellerSignUp/>}/>
        <Route path="forgot-password" element={<ForgotPassword />} />
        

      </Routes>
  )
}

export default AuthRoutes;
