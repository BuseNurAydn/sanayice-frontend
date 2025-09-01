
const OrangeButton = ({ children, onClick, type = "button",...rest}) => {
  return (
    <button
      type={type}
      onClick={onClick}
       {...rest}
      className="w-full flex flex-col items-center bg-[var(--color-dark-orange)] text-white py-4 rounded-lg hover:bg-orange-500 font-semibold mx-auto cursor-pointer"
    >
      {children}
    </button>
  );
};

export default OrangeButton;

