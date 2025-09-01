const AddButton = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className=" flex items-center justify-center gap-2 md:px-4 md:py-2 px-2 py-1 text-sm md:text-base bg-[var(--color-dark-orange)] text-white rounded-lg"
    >
      {children}
    </button>
  );
};
export default AddButton;