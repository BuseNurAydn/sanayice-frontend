const AddButton = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-2 bg-[var(--color-dark-orange)] text-white rounded-lg"
    >
      {children}
    </button>
  );
};
export default AddButton;