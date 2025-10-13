import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AdminText from "../../../shared/Text/AdminText";
import { IoWarningOutline, IoCloseOutline } from 'react-icons/io5';

const initialImages = [
  { id: 1, fileName: "urun_1.jpg", url: "https://via.placeholder.com/150/0000FF/808080?text=Urun+1", isSelected: false },
  { id: 2, fileName: "urun_2.png", url: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Urun+2", isSelected: false },
];

const MediaCenter = () => {
  const [images, setImages] = useState(initialImages);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectedCount = images.filter((img) => img.isSelected).length;

  // Görsel Seçme/Seçimi Kaldırma
  const toggleImageSelection = (id) => {
    setImages(images.map((img) => (img.id === id ? { ...img, isSelected: !img.isSelected } : img)));
  };

  // Tümünü Seç / Tümünün Seçimini Kaldır
  const toggleSelectAll = () => {
    const allSelected = selectedCount === images.length;
    setImages(images.map((img) => ({ ...img, isSelected: !allSelected })));
  };

  const handleOpenDeleteModal = () => {
    if (selectedCount > 0) {
      setShowDeleteModal(true);
    }
  };

  const handleDeleteSelectedConfirm = () => {
    setImages(images.filter((img) => !img.isSelected));
    setShowDeleteModal(false); // Modalı kapat
  };

  // Excel İndir (Gerçek URL ile)
  const handleExportToExcel = () => {
    const selected = images.filter((img) => img.isSelected);

    // Excel indirmek için görsel seçili değilse çık.
    if (selected.length === 0) return;

    const data = selected.map((img) => ({
      "Dosya Adı": img.fileName,
      // geçici test URL
      "Dosya Adresi": img.backendUrl || `https://your-backend.com/uploads/${img.fileName}`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Görseller");
    XLSX.writeFile(wb, "secili_gorseller.xlsx");
  };

  // Görsel Filtreleme
  const filteredImages = images.filter((img) => img.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

  // Dosya Yükleme (Frontend test)
  const handleFiles = (files) => {
    const newImages = Array.from(files).map((file, index) => ({
      id: images.length + index + 1,
      fileName: file.name,
      url: URL.createObjectURL(file), // frontend test için gösterim
      backendUrl: `https://your-backend.com/uploads/${file.name}`, // Excel için geçici gerçek URL
      isSelected: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Sürükle Bırak Yükleme
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Dosya Seçim Butonu
  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <AdminText>Medya Merkezi Yönetimi</AdminText>

      {/* Görsel Yükleme Alanı */}
      <div
        className="border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 p-12 text-center text-indigo-600 font-semibold rounded-lg cursor-pointer transition duration-300 mb-8"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        <p>Görsel Yüklemek İçin Sürükle ve Bırak</p>
        <p className="text-sm text-gray-500 mt-1">veya tıklayarak dosya seçin</p>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Kontrol Paneli */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Görsel Adı Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-full md:w-auto flex-grow outline-none"
        />

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={toggleSelectAll}
            className="py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition shrink-0"
          >
            {selectedCount === images.length ? "Tüm Seçimleri Kaldır" : "Tümünü Seç"}
          </button>
          <button
            onClick={handleOpenDeleteModal}
            disabled={selectedCount === 0}
            className="py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 shrink-0"
          >
            Seçilenleri Sil ({selectedCount})
          </button>
          <button
            onClick={handleExportToExcel}
            disabled={selectedCount === 0}
            className="py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 shrink-0"
          >
            Excel İndir
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Toplam Görsel: <span className="font-medium">{images.length}</span>
      </p>

      {/* Görsel Listesi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <div
              key={img.id}
              className={`bg-white border rounded-lg shadow-md hover:shadow-lg transition relative overflow-hidden group ${img.isSelected ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-200"}`}
            >
              <input
                type="checkbox"
                checked={img.isSelected}
                onChange={() => toggleImageSelection(img.id)}
                className="absolute top-3 left-3 h-5 w-5 text-indigo-600 bg-white border-gray-300 rounded-md z-10 cursor-pointer"
              />

              <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={img.url}
                  alt={img.fileName}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-3">
                <p className="text-xs text-gray-500 truncate" title={img.fileName}>
                  {img.fileName}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-5">
            Aradığınız kriterlere uygun görsel bulunamadı.
          </p>
        )}
      </div>

      {/*Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">

            {/* Modal Başlık */}
            <div className="flex justify-between items-center bg-red-50 p-4 border-b border-red-200">
              <h3 className="text-xl font-semibold text-red-800 flex items-center">
                <IoWarningOutline className="w-6 h-6 mr-2" /> Silme Onayı
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <IoCloseOutline className="w-7 h-7" />
              </button>
            </div>

            {/* Modal İçerik */}
            <div className="p-6 text-gray-700">
              <p className="mb-4 text-lg">
                Seçili <strong className="text-red-600">{selectedCount}</strong> görseli silmek istediğinizden emin misiniz?
              </p>
            </div>

            {/* Modal Butonlar */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteSelectedConfirm}
                className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
              >
                Evet, Sil ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MediaCenter;