import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';

const CategoriesSection = ({ categories }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-gray-900">Kategoriler</h2>
        <Link 
          to="/categories" 
          className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 flex items-center gap-1 group"
        >
          Tümünü Gör 
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;