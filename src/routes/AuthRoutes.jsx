import { Routes, Route } from 'react-router-dom';
import Login from '../features/auth/Login/Login';
import SignUp from '../features/auth/SignUp/SignUp';
import SellerSignUp from '../features/auth/SellerSignUp/SignUp'

const AuthRoutes = () => {
  return (
     <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path='signUp/seller' element={<SellerSignUp/>}/>
      </Routes>
  )
}

export default AuthRoutes;
