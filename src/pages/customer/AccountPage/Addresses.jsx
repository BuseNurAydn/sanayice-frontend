// src/components/Addresses.jsx
import { FaPlusCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Addresses = () => {
  // Fake address data (will come from API in a real application)
  const fakeAddresses = [
    {
      id: "addr1",
      title: "Ev Adresi",
      addressLine1: "Kazım Dirik Mah. 154. Sk. No: 5 Daire: 12",
      city: "Bornova",
      province: "İzmir",
      zipCode: "35100",
    },
    {
      id: "addr2",
      title: "İş Adresi",
      addressLine1: "Atatürk Cad. No: 100",
      city: "Konak",
      province: "İzmir",
      zipCode: "35200",
    },
  ];

  const handleEditAddress = (id) => {
    console.log(`Edit address with ID: ${id}`);
    // Implement logic to edit address (e.g., open a modal or navigate to an edit page)
  };

  const handleDeleteAddress = (id) => {
    console.log(`Delete address with ID: ${id}`);
    // Implement logic to delete address (e.g., dispatch a Redux action)
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Adres Bilgilerim</h2>

      <div className="space-y-4">
        {fakeAddresses.length > 0 ? (
          fakeAddresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <p className="text-lg font-semibold text-gray-800 mb-1">{address.title}</p>
                <p className="text-gray-700">{address.addressLine1}</p>
                <p className="text-gray-600">{address.city}, {address.province} {address.zipCode}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditAddress(address.id)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                  title="Adresi Düzenle"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                  title="Adresi Sil"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-base text-gray-500 italic mt-6 p-4 bg-gray-50 rounded-md">
            Henüz kayıtlı adresiniz bulunmamaktadır.
          </p>
        )}
      </div>

      <button className="mt-6 flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold py-2 px-4 rounded-md border border-orange-600 hover:bg-orange-50 transition-colors duration-200">
        <FaPlusCircle />
        Yeni Adres Ekle
      </button>
    </div>
  );
};

export default Addresses;