import ProductCard from "../components/ProductCard";

const CategorySection = ({ category }) => {
  const dummyProducts = [
    { id: "p1", name: "Ürün Yeri 1", price: "500", imageUrl: "https://via.placeholder.com/200x200" },
    { id: "p2", name: "Ürün Yeri 2", price: "300 ", imageUrl: "https://via.placeholder.com/200x200" },
    { id: "p3", name: "Ürün Yeri 3", price: "100", imageUrl: "https://via.placeholder.com/200x200" },
  ];

  const dummyBanners = [
    "https://via.placeholder.com/424x185.png?text=Banner+1",
    "https://via.placeholder.com/424x185.png?text=Banner+2",
    "https://via.placeholder.com/424x185.png?text=Banner+3",
  ];

  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{category.name}</h2>

      {/* Ürünler */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {(category.products?.length > 0 ? category.products : dummyProducts).map((product) => (
          <div key={product.id} className="flex-shrink-0 min-w-[224px] max-h-[330px]"> 
                 <ProductCard product={product} />
          </div>
        ))}
      </div>

{/**
      {/* Bannerlar 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {(category.banners?.length > 0 ? category.banners : dummyBanners).map((banner, i) => (
          <img
            key={i}
            src={banner}
            alt={`Banner ${i}`}
            className="w-[424px] h-[185.5px] object-cover rounded-xl shadow"
          />
        ))}
      </div>
       */}
    </section>
  );
};

export default CategorySection;

