
const Modal = ({ title, formData, onChange, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <input
          type="text"
          name="name"
          placeholder="Ad"
          value={formData.name}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none"
        />

        <textarea
          name="description"
          placeholder="Açıklama"
          value={formData.description}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Görsel URL"
          value={formData.imageUrl}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            İptal
          </button>
          <button onClick={onSave} className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;

