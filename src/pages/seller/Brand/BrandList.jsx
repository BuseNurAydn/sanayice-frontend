import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  fetchBrandsForManager, 
  deleteBrand, 
  toggleBrandStatus, 
  searchBrands, 
  getBrandsByStatus 
} from '../../../services/brandservice';
import AdminText from '../../../shared/Text/AdminText';
import { Search, Edit, Trash2, Eye, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    filterBrands();
  }, [searchTerm, statusFilter, brands]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await fetchBrandsForManager();
      setBrands(data);
      setFilteredBrands(data);
    } catch (error) {
      console.error('Markalar yüklenirken hata:', error);
      toast.error('Markalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filterBrands = () => {
    let filtered = brands;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(brand => 
        brand.active === (statusFilter === 'active')
      );
    }

    setFilteredBrands(filtered);
  };

  const handleDelete = async (id, brandName) => {
    if (window.confirm(`"${brandName}" markasını silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteBrand(id);
        toast.success('Marka başarıyla silindi');
        loadBrands();
      } catch (error) {
        console.error('Marka silinirken hata:', error);
        toast.error('Marka silinirken bir hata oluştu');
      }
    }
  };

  const handleToggleStatus = async (id, brandName) => {
    try {
      await toggleBrandStatus(id);
      toast.success(`${brandName} markasının durumu değiştirildi`);
      loadBrands();
    } catch (error) {
      console.error('Marka durumu değiştirilirken hata:', error);
      toast.error('Marka durumu değiştirilirken bir hata oluştu');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Markalar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-6 px-3 py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <AdminText>Marka Yönetimi</AdminText>
          <Link 
            to="/seller/add_brand" 
            className="bg-[var(--color-dark-orange)] text-white md:px-4 md:py-2 py-1 px-2 rounded hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Marka Ekle
          </Link>
        </div>

        {/* Arama ve Filtre */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Marka adı veya açıklamasına göre ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Markalar</option>
              <option value="active">Aktif Markalar</option>
              <option value="inactive">Pasif Markalar</option>
            </select>
          </div>
        </div>

        {/* Marka Listesi */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredBrands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Henüz marka bulunmamaktadır.</p>
              <Link 
                to="/manager/brands/add" 
                className="mt-4 inline-block bg-[var(--color-dark-orange)] text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                İlk Markayı Ekle
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marka
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBrands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {brand.imageUrl && (
                            <img 
                              src={brand.imageUrl} 
                              alt={brand.name}
                              className="w-10 h-10 rounded-full object-contain mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {brand.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {brand.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {brand.websiteUrl ? (
                          <a 
                            href={brand.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Website
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          brand.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {brand.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(brand.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/manager/brands/${brand.id}`}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Görüntüle"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/manager/brands/edit/${brand.id}`}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Düzenle"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(brand.id, brand.name)}
                            className="text-yellow-600 hover:text-yellow-800 p-1"
                            title={brand.active ? 'Pasif Yap' : 'Aktif Yap'}
                          >
                            {brand.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id, brand.name)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* İstatistikler */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{brands.length}</div>
            <div className="text-sm text-gray-500">Toplam Marka</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-green-600">
              {brands.filter(b => b.active).length}
            </div>
            <div className="text-sm text-gray-500">Aktif Marka</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-red-600">
              {brands.filter(b => !b.active).length}
            </div>
            <div className="text-sm text-gray-500">Pasif Marka</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandList;