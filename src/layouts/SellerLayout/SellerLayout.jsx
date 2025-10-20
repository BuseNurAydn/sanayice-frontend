import Header from './Header';
import Sidebar from './Sidebar';
import Footer from '../../components/Footer';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
     <div className="flex min-h-screen flex-col scrollbar-custom overflow-y-auto h-[400px]">
      <Header /> 
      <div className="flex flex-1 p-3 md:p-6">
        <Sidebar /> 
        <main className="flex-1 lg:pl-6 overflow-x-hidden">
             <Outlet /> {/* Sayfa içeriği buraya yansıyacak */}
        </main>
      </div>
      <Footer /> 
    </div>
  );
};

export default AdminLayout;
