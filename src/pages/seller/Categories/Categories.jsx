
import AdminText from '../../../shared/Text/AdminText';
import { useState} from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import { nanoid } from 'nanoid'; // benzersiz ID üretmek için
import AddButton from '../../../shared/Button/AddButton';
import { useNavigate} from 'react-router-dom';

const Categories = () => {
  
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'ELEKTRİK & ELEKTRONİK MALZEMELERİ',
      description: 'Elektronik ürünler',
      image: '',
      open: false,
      subcategories: [
        { id: 11, name: 'Güvenlik ve Alarm Sistemleri', description: 'Güvenlik ve Alarm Sistemleri', image: '' },
        { id: 22, name: 'Elektrik Tesisat Malzemeleri', description: 'Elektrik Tesisat Malzemeleri', image: '' },
      ],
    },
    {
      id: 2,
      name: 'OTOMASYON & PANO SİSTEMLERİ',
      description: 'Otomasyon ve Pano Sistemleri',
      image: '',
      open: false,
      subcategories: [
        { id: 21, name: 'PLC ve Kontrol Cihazları', description: 'PLC ve Kontrol Cihazları', image: '' },
        { id: 22, name: 'HMI ve Operatör Panelleri', description: 'HMI ve Operatör Panelleri', image: '' },
      ],
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, open: !cat.open } : cat
      )
    );
  };

  const handleEdit = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setFormData({
      name: item.name,
      description: item.description,
      image: item.image,
    });
    setShowModal(true);
  };

  const handleDelete = (item, type) => {
    setConfirmDelete({ item, type });
  };

  const confirmDeleteAction = () => {
    const { item, type } = confirmDelete;
    if (type === 'category') {
      setCategories((prev) => prev.filter((cat) => cat.id !== item.id));
    } else {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === item.parentId
            ? {
              ...cat,
              subcategories: cat.subcategories.filter(
                (sub) => sub.id !== item.id
              ),
            }
            : cat
        )
      );
    }
    setConfirmDelete(null);
  };
  const handleAddClick = (type, parentId = null) => {
    setModalType(type);
    setSelectedItem({ parentId }); // sadece alt kategori için geçerli
    setFormData({ name: '', description: '', image: '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalType === 'add-category') {
      setCategories(prev => [
        ...prev,
        {
          id: nanoid(),
          name: formData.name,
          description: formData.description,
          image: formData.image,
          open: false,
          subcategories: [],
        },
      ]);
    } else if (modalType === 'add-subcategory') {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === selectedItem.parentId
            ? {
              ...cat,
              subcategories: [
                ...cat.subcategories,
                {
                  id: nanoid(),
                  name: formData.name,
                  description: formData.description,
                  image: formData.image,
                },
              ],
            }
            : cat
        )
      );
    } else if (modalType === 'category') {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === selectedItem.id
            ? { ...cat, ...formData }
            : cat
        )
      );
    } else if (modalType === 'subcategory') {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === selectedItem.parentId
            ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === selectedItem.id ? { ...sub, ...formData } : sub
              ),
            }
            : cat
        )
      );
    }
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className='min-h-screen'>
      <AdminText>Kategoriler</AdminText>
      <div className="flex justify-end">
        <AddButton onClick={() => navigate('/seller/categories/add')}> Yeni Kategori </AddButton>
      </div>
      {categories.map((category) => (
        <div key={category.id} className=" p-4 mb-4 rounded shadow-md">
          <div className="flex items-center justify-between">
            <div onClick={() => toggleCategory(category.id)} className="cursor-pointer flex items-center gap-2">
              {category.open ? <FaChevronUp /> : <FaChevronDown />}
              <span>{category.name}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(category, 'category')} className="text-blue-500 hover:text-blue-700">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(category, 'category')} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <button onClick={() => handleAddClick('add-subcategory', category.id)} className="text-green-500 hover:text-green-700">
                <FcPlus />
              </button>
            </div>
          </div>

          {category.open && (
            <div className="mt-4 pl-6">
              {category.subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between border-b border-b-gray-200 py-2">
                  <span>{sub.name}</span>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit({ ...sub, parentId: category.id }, 'subcategory')} className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete({ ...sub, parentId: category.id }, 'subcategory')} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                    <button onClick={() => handleAddClick('add-subcategory', category.id)} className="text-green-500 hover:text-green-700">
                      <FcPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal (Ekle/Düzenle Ortak Kullanım) */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {modalType.includes('add') ? 'Yeni Ekle' : 'Düzenle'}
            </h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 rounded mb-3 outline-none"
              placeholder="Ad"
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 rounded mb-3 outline-none"
              placeholder="Açıklama"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSelectedItem((prev) => ({ ...prev, image: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border border-gray-200 px-3 py-2 rounded mb-3"
            />
            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt="Önizleme"
                className="w-full h-auto max-h-60 object-contain rounded mb-3"
              />
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">İptal</button>
              <button onClick={handleSave} className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onayı */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <p className="mb-4">Silmek istediğinize emin misiniz?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-300 px-4 py-2 rounded">İptal</button>
              <button onClick={confirmDeleteAction} className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded">Evet</button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
export default Categories;

