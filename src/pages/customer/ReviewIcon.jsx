
export const ReviewIcon = ({ count}) => {
  return (
    <div className="relative inline-block">
      <p className=" text-gray-600">Değerlendirmeler</p>
        <span
          className="absolute top-1 -right-6 bg-[var(--color-orange)] text-white text-xs font-bold rounded-full px-1.5 py-0.5"
        >
          {count || 0}
        </span>
    </div>
  );
};
