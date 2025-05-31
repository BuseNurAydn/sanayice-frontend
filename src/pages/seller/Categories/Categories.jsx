import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import { FaChevronDown, FaChevronUp, FaTrash, FaEdit } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import AdminText from "../../../shared/Text/AdminText";
import AddButton from "../../../shared/Button/AddButton";
import SubModal from "./SubModal";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [deleteType, setDeleteType] = useState("category");

  //Kategorileri listeleme
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/managers/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token'ı burada kullandık
        },
      });

      if (!response.ok) {
        throw new Error("Kategoriler alınamadı");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Kategoriler alınırken hata oluştu:", error);
    }
  };

  //Alt kategorileri listeleme
  const fetchSubcategories = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/managers/subcategories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Alt kategoriler alınamadı");
      }

      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Alt kategoriler alınırken hata oluştu:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  //Ekleme sayfasına yönlendirme
  const handleAdd = () => {
    navigate("/seller/categories/add"); // Kategori ekleme sayfama yönlendirme
  };

  //Ana kategori ve alt kategoriyi silme
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    const endpoint =
      deleteType === "subcategory"
        ? `/api/managers/subcategories/${deleteId}`
        : `/api/managers/categories/${deleteId}`;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Silme işlemi başarısız");
      }

      deleteType === "subcategory" ? fetchSubcategories() : fetchCategories();
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  };

  //Kategori Düzenleme İşlemi
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
    console.log("Kaydedilen Kategori:", formData, "ID:", editingId);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/managers/categories/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Güncelleme başarılı");
        setIsModalOpen(false);
        setEditingId(null);
        fetchCategories(); // listeyi yenile
      } else {
        const errorData = await response.json();
        console.error("Güncelleme başarısız:", errorData);
      }
    } catch (error) {
      console.error("Hata oluştu:", error);
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
    const token = localStorage.getItem("token");

    const newSubcategory = {
      name: subFormData.name,
      description: subFormData.description,
      imageUrl: subFormData.imageUrl,
      categoryId: selectedCategoryId,
    };

    console.log("Seçilen Kategori ID:", selectedCategoryId);
    console.log("Gönderilen Alt Kategori:", newSubcategory);

     try {
    const url = editingId
      ? `/api/managers/subcategories/${editingId}`
      : "/api/managers/subcategories";

    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSubcategory),
    });

    if (!response.ok) {
      throw new Error("Alt kategori kaydedilemedi");
    }

    await fetchSubcategories();
    await fetchCategories();

    setIsSubModalOpen(false);
    setSubFormData({ name: "", description: "", imageUrl: "" });
    setEditingId(null); // resetle

  } catch (error) {
    console.error("Alt kategori işlemi hatası:", error);
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
    <div className=" min-h-screen">
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
                >
                  <FcPlus size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(category); }}
                  className="text-blue-600 hover:text-blue-800"
                >
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
  );
};
export default Categories;