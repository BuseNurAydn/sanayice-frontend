import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`kategori/${category.id}`);
    };

    return (
        <div
            key={category.id}
            onClick={handleNavigate}
            className="relative rounded-xl overflow-hidden shadow-xl group cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 w-full h-[185.5px]"
            style={{
                height: "185.5px",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60 group-hover:from-black/50 group-hover:to-black/80 transition-all duration-300" />

            
            {/* İçerik */}
            <div className="relative z-10 p-6 flex flex-col h-full justify-center">
                <h3 className="md:text-xl text-lg font-bold text-white mb-2 drop-shadow-md">{category.name}</h3>
              

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
