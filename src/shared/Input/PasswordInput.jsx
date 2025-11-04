import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "./Input";

const PasswordInput = ({ name, placeholder, value, onChange, className = "" }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} w-full pr-[48px]`}
      />
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
        onClick={() => setShow(!show)}
      >
        {show ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </span>
    </div>
  );
};

export default PasswordInput;

