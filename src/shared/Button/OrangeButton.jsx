
const OrangeButton = ({ children, onClick, type = "button",...rest}) => {
  return (
    <button
      type={type}
      onClick={onClick}
       {...rest}
      className="w-3/4 flex flex-col items-center bg-[var(--color-dark-orange)] text-white py-5 rounded-full hover:bg-orange-500 font-semibold mx-auto cursor-pointer"
    >
      {children}
    </button>
  );
};

export default OrangeButton;

