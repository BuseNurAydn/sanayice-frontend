
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse h-[330px] w-full border border-gray-100">
      {/* Resim Alanı */}
      <div className="h-[180px] bg-gray-200 w-full"></div>
      
      <div className="p-3">
        {/* Başlık Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        {/* Açıklama Placeholder */}
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        {/* Fiyat Placeholder */}
        <div className="h-6 bg-orange-400 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;