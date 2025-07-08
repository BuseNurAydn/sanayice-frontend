import Header from '../../components/Header';
import Footer from '../../layouts/CustomerLayout/Footer';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../../services/categoryService';

const CustomerLayout = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(data => setCategories(data));
  }, []);

  return (
     <div className="flex min-h-screen flex-col scrollbar-custom overflow-y-auto h-[400px]">
       <Header categories={categories} />
      <div className="flex flex-1">
        <main className="flex-1 overflow-x-hidden">
             <Outlet /> {/* Sayfa içeriği buraya yansıyacak */}
        </main>
      </div>
      <Footer /> 
    </div>
  );
};

export default CustomerLayout;

