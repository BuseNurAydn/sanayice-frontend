import Header from '../../components/Header';
import Footer from '../../layouts/CustomerLayout/Footer';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
     <div className="flex min-h-screen flex-col">
      <Header /> 
      <div className="flex flex-1">
        <main className="flex-1 overflow-auto">
             <Outlet /> {/* Sayfa içeriği buraya yansıyacak */}
        </main>
      </div>
      <Footer /> 
    </div>
  );
};

export default CustomerLayout;

