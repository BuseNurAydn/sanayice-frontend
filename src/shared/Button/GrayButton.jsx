const GrayButton = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full border border-gray-400 text-gray-700 py-2 rounded-lg flex items-center justify-center cursor-pointer gap-2"
    >
      {children}
    </button>
  );
};
export default GrayButton;
