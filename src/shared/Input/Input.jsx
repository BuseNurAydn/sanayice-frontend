const Input = ({ type = "text", name, placeholder, value, onChange, disabled = false, className = "" }) => {
  return (
    <input
      type={type}
      name={name}    
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`h-[57px] border border-neutral-600 bg-[var(--color-grey)] rounded-lg px-4 py-7 outline-none font-medium custom-font ${className}`}
    />
  );
};

export default Input;