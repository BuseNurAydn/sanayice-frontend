import ProductCardSkeleton from './ProductCardSkeleton'; 

const CategorySectionSkeleton = () => {
  return (
    <section className="mb-16 p-4 bg-white rounded-lg shadow-md animate-pulse">
      {/* Başlık Alanı */}
      <div className="flex items-center justify-between mb-8">
        {/* Kategori Başlığı Placeholder */}
        <div className="h-6 w-64 bg-gray-300 rounded"></div>
      </div>

      {/* Ürün Kaydırıcı İskeleti */}
      <div className="flex gap-5 overflow-hidden pb-4">
        {/* 4 adet ürün iskeleti gösterelim */}
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="flex-shrink-0 min-w-[224px]">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
};
export default CategorySectionSkeleton;