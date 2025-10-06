import AdminText from '../../../shared/Text/AdminText';
import { useState } from 'react';
import { UploadCloud, ListChecks } from "lucide-react";
import { GrCatalog } from "react-icons/gr";
import SingleProductForm from './SingleProductForm';
import BulkUpload from './BulkUpload';
import { HiArrowNarrowLeft } from "react-icons/hi";

const Card = ({ icon: Icon, title, description, onClick, isSelected }) => {
    const baseStyle = "p-6 border rounded-xl cursor-pointer transition duration-300 flex flex-col items-center text-center space-y-3 shadow-sm";
    const selectedStyle = "border-orange-500 bg-orange-50 ring-2 ring-orange-500";
    const defaultStyle = "border-gray-200 hover:border-orange-300 hover:shadow-md";

    return (
        <div
            className={`${baseStyle} ${isSelected ? selectedStyle : defaultStyle}`}
            onClick={onClick}
        >
            <Icon className={`w-8 h-8 ${isSelected ? 'text-orange-600' : 'text-gray-500'}`} />
            <h4 className="font-semibold text-lg">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
};

const AddProduct = () => {
    // 0: Hiçbir şey seçili değil (kartlar gösteriliyor)
    // 1: Tekli Ürün Ekleme (Form)
    // 2: Toplu Ürün Yükleme (BulkUpload)
    // 3: Sanayice Kataloğundan Ürün Yükleme
    const [selectedMode, setSelectedMode] = useState(0);

    return (
        <div className='min-h-screen bg-gray-50 px-3 py-6 md:p-6'>
            <AdminText>Ürün Ekleme</AdminText>

            {/* Satıcı Bilgilendirme Alanı */}
            <div className='bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mt-6 mb-8 rounded-lg'>
                <p className='font-medium mb-2'>Değerli Satıcımız,</p>
                <p className='text-sm'>
                    Ürünlerinizi listelemek için aşağıdaki üç yöntemden birini seçebilirsiniz. Lütfen size en uygun olan yöntemi belirleyiniz. Yüklediğiniz tüm ürünler, yayınlanmadan önce onay sürecinden geçecektir.
                </p>
            </div>

            {/* Kart Seçim Alanı */}
            {selectedMode === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                    {/* 1. Kart: Tekli Ürün Yükleme */}
                    <Card
                        icon={ListChecks}
                        title="Tekli Ürün Ekle"
                        description="Hızlıca tek bir ürünün tüm detaylarını ve görsellerini girerek listeleyin."
                        onClick={() => setSelectedMode(1)}
                        isSelected={selectedMode === 1}
                    />

                    {/* 2. Kart: Toplu Ürün Yükleme */}
                    <Card
                        icon={UploadCloud}
                        title="Toplu Ürün Yükleme (Excel)"
                        description="Çok sayıda ürünü tek seferde Excel dosyası ile yükleyin ve zamandan kazanın."
                        onClick={() => setSelectedMode(2)}
                        isSelected={selectedMode === 2}
                    />

                    {/* 3. Kart: Sanayice Kataloğundan Yükleme */}
                    <Card
                        icon={GrCatalog}
                        title="Katalogdan Ürün Ekle"
                        description="Sanayice'nin hazır ürün kataloğundan ürün seçerek listeleme işlemini hızlandırın. (Yakında)"
                        onClick={() => setSelectedMode(3)}
                        isSelected={selectedMode === 3}
                    />
                </div>
            )}

            {/* İçerik Alanı */}
            <div className='mt-8'>
                {/* Tekli Ürün Ekleme Formu */}
                {selectedMode === 1 && (
                    <div className='p-4 border border-gray-200 rounded-lg bg-white shadow'>
                        <button
                            onClick={() => setSelectedMode(0)}
                            className="text-orange-500 cursor-pointer hover:text-orange-700 font-medium mb-4 flex items-center"
                        >
                            < HiArrowNarrowLeft className='mr-2'/> Yükleme Yöntemlerine Geri Dön
                        </button>
                        <h2 className="text-lg font-bold mb-4">Yeni Ürün Girişi</h2>
                        <hr className='mb-6 text-gray-300'/>
                        <SingleProductForm /> 
                    </div>
                )}

                {/* Toplu Ürün Yükleme Bileşeni */}
                {selectedMode === 2 && (
                    <div className='p-4 border border-gray-200 rounded-lg bg-white shadow'>
                        <button
                            onClick={() => setSelectedMode(0)}
                            className="text-orange-500 cursor-pointer hover:text-orange-700 font-medium mb-4 flex items-center"
                        >
                          < HiArrowNarrowLeft className='mr-2'/>  Yükleme Yöntemlerine Geri Dön
                        </button>
                        <h2 className="text-lg font-bold mb-4">Excel ile Toplu Ürün Yükleme</h2>
                        <hr className='mb-6 text-gray-300'/>
                        <BulkUpload />
                    </div>
                )}
                
                {/* Katalogdan Ürün Yükleme (Şimdilik Bilgilendirme) */}
                {selectedMode === 3 && (
                    <div className='p-6 border border-gray-300 rounded-lg bg-white shadow'>
                        <button
                            onClick={() => setSelectedMode(0)}
                            className="text-orange-500 hover:text-orange-700 font-medium mb-4 flex items-center"
                        >
                          < HiArrowNarrowLeft className='mr-2'/>  Yükleme Yöntemlerine Geri Dön
                        </button>
                        <h2 className="text-lg font-bold mb-4">Katalogdan Ürün Ekleme</h2>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AddProduct;
