import Logo from '../../assets/png/Logo2.png'
import { BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import {Link} from 'react-router-dom'

const Header = () => {
  const iconStyle = 'bg-[var(--color-orange)] px-2 py-1'
  return (
    <header className='bg-[var(--color-light)] p-2 pl-10 md:pl-4 flex justify-between'>
      <Link to="/seller/dashboard">
         <img src={Logo} alt="Logo" className='cursor-pointer'/>
      </Link>
      <div className="flex flex-row space-x-1 items-center pr-2">
       <Link to="#" className={iconStyle}><BsBellFill /></Link> 
       <Link to="/seller/profile" className={iconStyle}><FaUser /></Link>
      </div>
    </header>
  )
}

export default Header;
