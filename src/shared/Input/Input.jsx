const Input = ({ type = "text", name, placeholder, value, onChange, disabled = false, className = "" }) => {
  return (
    <input
      type={type}
      name={name}    
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`h-[57px] border border-gray-200 focus:border-[var(--color-dark-orange)] focus:outline-none bg-[var(--color-grey)] rounded-lg px-4 outline-none text-sm custom-font  w-full box-border ${className}`}
    />
  );
};

export default Input;