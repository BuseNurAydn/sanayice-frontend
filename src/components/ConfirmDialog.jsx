const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-6 text-center">
        <p className="text-md mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            Hayır
          </button>
          <button onClick={onConfirm} className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded">
            Evet
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;