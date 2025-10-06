import React, { useState, useEffect, useRef } from "react";

import { fetchCategories, fetchSubcategories } from "../../../services/categoryService";
import { bulkImportProducts } from "../../../services/sellerProductService";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import { FaFileExcel } from "react-icons/fa6";
import * as XLSX from "xlsx";

const BulkUpload = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const fileInputRef = useRef(null);
  const filteredSubcategories = categories.find(cat => cat.id === categoryId)?.subcategories || [];


  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id); // ilk kategori seçili olsun
    }
  }, [categories]);

  useEffect(() => {
    if (filteredSubcategories.length > 0 && !subcategoryId) {
      setSubcategoryId(filteredSubcategories[0].id); // ilk alt kategori seçili olsun
    }
  }, [filteredSubcategories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await fetchCategories();
        const subs = await fetchSubcategories();
        setCategories(cats);
        setSubcategories(subs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!categoryId || !subcategoryId || !excelFile) {
      toast.error("Kategori, alt kategori ve Excel dosyası gerekli!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Excel oku
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const ws = workbook.Sheets[workbook.SheetNames[0]];

        // Sheet'i JSON olarak al (header:1 → array of arrays)
         let sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Başlıklara kategori sütunlarını ekle
         sheetData[0].push("KATEGORİ", "ALT KATEGORİ");

        // Her ürün satırına kategori bilgilerini ekle
       for (let i = 1; i < sheetData.length; i++) {
        if (sheetData[i] && sheetData[i].length > 0) {
          sheetData[i].push(categoryId, subcategoryId);
        }
      }

        // Yeni sheet oluştur
        const newWs = XLSX.utils.aoa_to_sheet(sheetData);
        workbook.Sheets[workbook.SheetNames[0]] = newWs;

        const jsonPreview = XLSX.utils.sheet_to_json(newWs, { header: 1 });
        console.log("Güncellenmiş Excel:", jsonPreview);


        // Yeni Excel dosyası oluştur
        const updatedExcel = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const updatedFile = new File(
          [updatedExcel],
          `updated_${excelFile.name}`,
          { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        );

        // FormData ile backend’e gönder
        const formData = new FormData();
        formData.append("file", updatedFile);

        await bulkImportProducts(formData);
        toast.success("Excel güncellendi ve yüklendi!");
        setExcelFile(null);
       
      } catch (err) {
        console.error(err);
        toast.error("Excel işlenemedi!");
      }
    };

    reader.readAsArrayBuffer(excelFile);
  };

  return (
    <div className="border border-gray-100 md:p-4 p-2 rounded-lg shadow">

      <button
        onClick={() => {
          window.open("/Ornek-Excel.xlsx", "_blank");
        }}
        className="bg-green-500 text-white px-2 py-1 text-sm rounded mb-4 hover:bg-green-600 flex items-center gap-1 cursor-pointer"
      >
        <FaFileExcel /> Örnek Excel Dosyasını İndir
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-bold text-gray-500">Kategoriler</label>
          <div className="border border-gray-300 rounded p-2">
            {categories.map(cat => (
              <div
                key={cat.id}
                className={`p-2 cursor-pointer rounded hover:bg-orange-50 ${categoryId === cat.id ? "bg-orange-100 font-semibold" : ""
                  }`}
                onClick={() => setCategoryId(cat.id)}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-bold text-gray-500">Alt Kategoriler</label>
          <div className="border border-gray-300 rounded p-2">
            {filteredSubcategories.map(sub => (
              <div
                key={sub.id}
                className={`p-2 cursor-pointer rounded hover:bg-orange-50 ${subcategoryId === sub.id ? "bg-orange-100 font-semibold" : ""
                  }`}
                onClick={() => setSubcategoryId(sub.id)}
              >
                {sub.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-bold text-gray-500">Excel Dosyası</label>
          {/* Tıklanabilir kutu */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer w-64 h-32 flex items-center justify-center"
            onClick={handleClick}
          >
            <Upload className="w-6 h-6 text-gray-400 mr-2" />
            <p className="text-gray-500 text-center">Excel Dosyası Yükle</p>
          </div>

          {/* Gizli input */}
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />

          {/* Seçilen dosya adı */}
          {excelFile && (
            <p className="mt-2 text-sm text-gray-700">
              Seçilen Dosya: {excelFile.name}
            </p>
          )}

        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-[var(--color-orange)] text-white px-4 py-2 rounded hover:bg-orange-500"
      >
        Onaya Gönder
      </button>
    </div>
  );
};

export default BulkUpload;
