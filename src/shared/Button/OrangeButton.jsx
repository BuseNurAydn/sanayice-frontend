
const OrangeButton = ({ children, onClick, type = "button",...rest}) => {
  return (
    <button
      type={type}
      onClick={onClick}
       {...rest}
      className="w-full flex flex-row justify-center items-center hover:bg-[var(--color-dark-orange)] text-white py-4 rounded-lg bg-orange-500 font-semibold mx-auto cursor-pointer"
    >
      {children}
    </button>
  );
};

export default OrangeButton;

