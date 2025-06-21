import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`category/${category.id}`);
    };

    return (
        <div
            key={category.id}
            onClick={handleNavigate}
            className="relative rounded-3xl overflow-hidden h-60 shadow-xl group cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{
                backgroundImage: `url(${category.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60 group-hover:from-black/50 group-hover:to-black/80 transition-all duration-300" />

            {/* Etiket */}
            <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {category.name.split(" ")[0]}
            </span>

            {/* İçerik */}
            <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{category.name}</h3>
                <p className="text-white text-sm mb-3 opacity-90 line-clamp-2">{category.description}</p>

                <button
                    onClick={(e) => {
                        e.stopPropagation(); // kartın onClick'ini tetiklemesin
                        handleNavigate();
                    }}
                    className="w-fit px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white font-semibold text-sm transition-all duration-200 border border-white/30 flex items-center gap-2">
                    Keşfet <FaArrowRight className="text-xs" />
                </button>
            </div>
        </div>
    );
};
export default CategoryCard;
