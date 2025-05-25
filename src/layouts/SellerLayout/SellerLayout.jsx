import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
     <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header /> 
      <div className="flex flex-1 p-6">
        <Sidebar /> 
        <main className="flex-1 md:pl-6 overflow-auto">
             <Outlet /> {/* Sayfa içeriği buraya yansıyacak */}
        </main>
      </div>
      <Footer /> 
    </div>
  );
};

export default AdminLayout;
