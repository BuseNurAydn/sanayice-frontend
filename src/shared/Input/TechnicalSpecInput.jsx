

const TechSpecInput = ({ spec, index, onChange, onRemove }) => {
  const inputStyle = 'border border-gray-300 p-2 w-full rounded outline-none';

  return (
    <div className="flex gap-2 mb-2 items-center">
      <input
        type="text"
        placeholder="Özellik Adı"
        value={spec.key || ''}
        onChange={(e) => onChange(index, 'key', e.target.value)}
        className={inputStyle}
      />
      <input
        type="text"
        placeholder="Değeri"
        value={spec.value || ''}
        onChange={(e) => onChange(index, 'value', e.target.value)}
        className={inputStyle}
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default TechSpecInput;
