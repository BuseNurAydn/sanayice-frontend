import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { FaChevronDown, FaChevronUp, FaTrash, FaEdit } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import AdminText from "../../../shared/Text/AdminText";
import AddButton from "../../../shared/Button/AddButton";
import SubModal from "./SubModal";
import {fetchCategories,fetchSubcategories,deleteCategory,updateCategory,saveSubcategory,} from "../../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [deleteType, setDeleteType] = useState("category");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [subFormData, setSubFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

 useEffect(() => {
  const load = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);

      const subs = await fetchSubcategories();
      setSubcategories(subs);
    } catch (error) {
      console.error(error);
    }
  };
  load();
}, []);

  //Ekleme sayfasına yönlendirme
  const handleAdd = () => {
    navigate("/seller/categories/add"); // Kategori ekleme sayfama yönlendirme
  };

  //Silme
const handleDelete = async () => {
  try {
    await deleteCategory(deleteId, deleteType);
    setConfirmOpen(false);
    setDeleteId(null);

    if (deleteType === "subcategory") {
      const subs = await fetchSubcategories();
      setSubcategories(subs);
    } else {
      const cats = await fetchCategories();
      setCategories(cats);
    }
  } catch (error) {
    console.error(error);
  }
};

  //Düzenleme
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
  try {
    await updateCategory(editingId, formData);
    setIsModalOpen(false);
    setEditingId(null);
    const cats = await fetchCategories();
    setCategories(cats);
  } catch (error) {
    console.error(error);
  }
};
  // Sub Kategori - İnput değişikliklerini dinleme
  const handleSubChange = (e) => {
    const { name, value } = e.target;
    setSubFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Ana ve alt kategori ekleme
  const handleSubSave = async () => {
  try {
    await saveSubcategory(editingId, {
      ...subFormData,
      categoryId: selectedCategoryId,
    });
    setIsSubModalOpen(false);
    setSubFormData({ name: "", description: "", imageUrl: "" });
    setEditingId(null);
    const subs = await fetchSubcategories();
    setSubcategories(subs);
    const cats = await fetchCategories();
    setCategories(cats);
  } catch (error) {
    console.error(error);
  }
};
  // Alt kategoriyi düzenleme
  const handleEditSub = (sub) => {
  setSubFormData({
    name: sub.name,
    description: sub.description,
    imageUrl: sub.imageUrl,
  });
  setEditingId(sub.id); // Alt kategori ID
  setSelectedCategoryId(sub.categoryId); // Hangi kategoriye ait olduğu
  setIsSubModalOpen(true);
};

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <AdminText>Kategoriler</AdminText>
        <AddButton onClick={handleAdd}>Yeni Kategori Ekle</AddButton>
      </div>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-4 border border-gray-100 rounded shadow bg-white">
            <div className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => setOpenCategoryId(openCategoryId === category.id ? null : category.id)}
            >
              {/* Sol taraf: Accordion icon + kategori adı */}
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {openCategoryId === category.id ? <FaChevronUp className="text-[var(--color-dark-orange)]" /> : <FaChevronDown className="text-[var(--color-dark-orange)]" />}
                </span>
                <span className="text-xs md:text-sm font-medium custom-font">{category.name}</span>
              </div>

              {/* Sağ taraf: Edit ve delete ikonları */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategoryId(category.id);
                    setIsSubModalOpen(true);
                  }}
                  title="Alt Kategori Ekle"
                >
                  <FcPlus size={18} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(category); }} title="Kategori Düzenle" className="text-blue-600 hover:text-blue-800">
                  <FaEdit size={18} />
                </button>
                {isModalOpen && (
                  <Modal
                    title="Kategori Güncelle"
                    formData={formData}
                    onChange={handleChange}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                  />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(category.id);
                    setDeleteType("category");
                    setConfirmOpen(true);
                  }}
                  title="Kategori Sil"
                  className="text-red-600 hover:text-red-800"
                  >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
            {openCategoryId === category.id && (
              <div>
                {/* Alt kategoriler burada */}
                <ul className="divide-y divide-gray-200 ">
                  {subcategories
                    .filter((sub) => sub.categoryId === category.id)
                    .map((sub) => (
                      <li key={sub.id} className="pl-11 pr-4 py-2 flex items-center justify-between">
                        <div className="text-gray-900 text-sm">{sub.name}</div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditSub(sub); }}
                            className="text-blue-600 hover:text-blue-800">
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(sub.id);
                              setDeleteType("subcategory");
                              setConfirmOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {confirmOpen && (
        <ConfirmDialog
          message={`Bu ${deleteType === "subcategory" ? "alt kategoriyi" : "kategoriyi"} silmek istediğinize emin misiniz?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
      {isSubModalOpen && (
        <SubModal title="Alt Kategori Ekle" subFormData={subFormData} onChange={handleSubChange} onSave={handleSubSave}
          onClose={() => setIsSubModalOpen(false)}/>
      )}
      </div>
    </div>
  );
};
export default Categories;