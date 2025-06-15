import { useState, useEffect } from "react";
import { FaCreditCard, FaMapMarkerAlt, FaCheckCircle, FaPlus, FaEdit, FaTrash, FaTruck, FaClock, FaShieldAlt } from "react-icons/fa";

const CheckoutPage = () => {
  // Mock kargo firmaları ve fiyatları
  const [shippingOptions, setShippingOptions] = useState([
    {
      id: 'aras',
      name: 'Aras Kargo',
      price: 29.90,
      estimatedDays: '1-2',
      description: 'Hızlı ve güvenli teslimat',
      icon: '🚚',
      features: ['Kapıda ödeme', 'SMS bilgilendirme', 'Online takip']
    },
    {
      id: 'mng',
      name: 'MNG Kargo',
      price: 27.50,
      estimatedDays: '1-3',
      description: 'Ekonomik teslimat seçeneği',
      icon: '📦',
      features: ['Kapıda ödeme', 'Online takip']
    },
    {
      id: 'yurtici',
      name: 'Yurtiçi Kargo',
      price: 32.00,
      estimatedDays: '1-2',
      description: 'Güvenilir teslimat',
      icon: '🚛',
      features: ['Kapıda ödeme', 'SMS bilgilendirme', 'Online takip', 'Sigortası']
    },
    {
      id: 'ptt',
      name: 'PTT Kargo',
      price: 25.00,
      estimatedDays: '2-4',
      description: 'Devlet güvencesi',
      icon: '📮',
      features: ['Kapıda ödeme', 'Online takip']
    },
    {
      id: 'surat',
      name: 'Sürat Kargo',
      price: 31.20,
      estimatedDays: '1-2',
      description: 'Hızlı teslimat garantisi',
      icon: '⚡',
      features: ['Kapıda ödeme', 'SMS bilgilendirme', 'Online takip']
    }
  ]);

  // Mock kayıtlı adresler
  const [savedAddresses] = useState([
    {
      id: 1,
      title: "Ev Adresim",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      address: "Atatürk Mahallesi, Cumhuriyet Caddesi No: 15 Daire: 3",
      city: "İstanbul",
      district: "Kadıköy",
      postalCode: "34710",
      phone: "0532 123 45 67",
      isDefault: true
    },
    {
      id: 2,
      title: "İş Adresim",
      firstName: "Ahmet",
      lastName: "Yılmaz",
      address: "Levent Mahallesi, İş Merkezi Sokak No: 23 Kat: 5",
      city: "İstanbul",
      district: "Beşiktaş",
      postalCode: "34330",
      phone: "0532 123 45 67",
      isDefault: false
    }
  ]);

  // Mock cart items
  const cartItems = [
    { id: 1, name: "iPhone 14", brand: "Apple", price: 25000, quantity: 1, image: "https://via.placeholder.com/100", weight: 0.5, dimensions: { width: 15, height: 20, depth: 3 } },
    { id: 2, name: "MacBook Air", brand: "Apple", price: 35000, quantity: 1, image: "https://via.placeholder.com/100", weight: 1.2, dimensions: { width: 30, height: 40, depth: 5 } }
  ];

  const [formData, setFormData] = useState({
    // Adres bilgileri
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    phone: "",
    // Kart bilgileri
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    // Diğer
    paymentMethod: "credit-card",
    saveAddress: false,
    // Kargo seçimi
    selectedShipping: 'aras'
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Adres, 2: Kargo, 3: Ödeme, 4: Onay
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses.find(addr => addr.isDefault)?.id || null);
  const [shippingCalculating, setShippingCalculating] = useState(false);

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getSelectedShippingPrice = () => {
    const selected = shippingOptions.find(option => option.id === formData.selectedShipping);
    return selected ? selected.price : 0;
  };

  const getFinalTotal = () => getTotal() + getSelectedShippingPrice();

  // Kargo fiyatlarını hesapla (API simülasyonu)
  const calculateShippingRates = async (address) => {
    setShippingCalculating(true);
    
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Şehir bazlı fiyat hesaplama simülasyonu
    const cityMultiplier = address.city === 'İstanbul' ? 1 : 1.2;
    const totalWeight = cartItems.reduce((acc, item) => acc + (item.weight || 0.5) * item.quantity, 0);
    const weightMultiplier = totalWeight > 2 ? 1.3 : 1;
    
    const updatedOptions = shippingOptions.map(option => ({
      ...option,
      price: Math.round(option.price * cityMultiplier * weightMultiplier * 100) / 100,
      estimatedDays: address.city === 'İstanbul' ? option.estimatedDays : 
                    option.estimatedDays.split('-').map(d => parseInt(d) + 1).join('-')
    }));
    
    setShippingOptions(updatedOptions);
    setShippingCalculating(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setFormData(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, expiryDate: value }));
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowAddressForm(false);
    
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setFormData(prev => ({
        ...prev,
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        address: selectedAddress.address,
        city: selectedAddress.city,
        district: selectedAddress.district,
        postalCode: selectedAddress.postalCode,
        phone: selectedAddress.phone,
      }));
      
      // Kargo fiyatlarını yeniden hesapla
      calculateShippingRates(selectedAddress);
    }
  };

  const handleNewAddress = () => {
    setSelectedAddressId(null);
    setShowAddressForm(true);
    setFormData(prev => ({
      ...prev,
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      district: "",
      postalCode: "",
      phone: "",
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!showAddressForm && selectedAddressId) {
        return true;
      }
      const required = ['firstName', 'lastName', 'address', 'city', 'district', 'phone'];
      return required.every(field => formData[field].trim() !== '');
    }
    if (step === 2) {
      return formData.selectedShipping !== '';
    }
    if (step === 3) {
      if (formData.paymentMethod === 'credit-card') {
        return formData.cardNumber.replace(/\s/g, '').length === 16 &&
               formData.cardHolder.trim() !== '' &&
               formData.expiryDate.length === 5 &&
               formData.cvv.length === 3;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1 && showAddressForm) {
        // Yeni adres girildi, kargo fiyatlarını hesapla
        const newAddress = {
          city: formData.city,
          district: formData.district
        };
        calculateShippingRates(newAddress);
      }
      setCurrentStep(prev => prev + 1);
    } else {
      alert("Lütfen tüm gerekli alanları doldurun");
    }
  };

  const handleCompleteOrder = () => {
    alert("Siparişiniz başarıyla alındı!");
  };

  const handleBackToCart = () => {
    alert("Sepete dönülüyor...");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-20 h-1 ${
              currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSavedAddresses = () => (
    <div className="space-y-3 mb-4">
      {savedAddresses.map((address) => (
        <div
          key={address.id}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedAddressId === address.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-300'
          }`}
          onClick={() => handleAddressSelect(address.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedAddressId === address.id}
                onChange={() => handleAddressSelect(address.id)}
                className="mr-3"
              />
              <div>
                <div className="flex items-center">
                  <h4 className="font-semibold text-gray-800">{address.title}</h4>
                  {address.isDefault && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Varsayılan
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {address.firstName} {address.lastName}
                </p>
                <p className="text-gray-600 text-sm">
                  {address.address}
                </p>
                <p className="text-gray-600 text-sm">
                  {address.district}, {address.city} {address.postalCode}
                </p>
                <p className="text-gray-600 text-sm">
                  {address.phone}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-orange-500">
                <FaEdit />
              </button>
              <button className="text-gray-400 hover:text-red-500">
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddressForm = () => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="font-semibold mb-3">Yeni Adres Ekle</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="Ad"
          value={formData.firstName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Soyad"
          value={formData.lastName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefon"
          value={formData.phone}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Posta Kodu"
          value={formData.postalCode}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
        />
        <input
          type="text"
          name="city"
          placeholder="Şehir"
          value={formData.city}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
          required
        />
        <input
          type="text"
          name="district"
          placeholder="İlçe"
          value={formData.district}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
          required
        />
        <textarea
          name="address"
          placeholder="Adres"
          value={formData.address}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 md:col-span-2"
          rows="3"
          required
        />
      </div>
      
      <label className="flex items-center mt-4">
        <input
          type="checkbox"
          name="saveAddress"
          checked={formData.saveAddress}
          onChange={handleInputChange}
          className="mr-2"
        />
        <span className="text-sm text-gray-600">Bu adresi kaydet</span>
      </label>
    </div>
  );

  const renderAddressStep = () => (
    <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
      <div className="flex items-center mb-6">
        <FaMapMarkerAlt className="text-orange-500 mr-2" />
        <h2 className="text-xl font-semibold">Teslimat Adresi</h2>
      </div>
      
      {savedAddresses.length > 0 && !showAddressForm && (
        <div>
          <h3 className="font-semibold mb-3">Kayıtlı Adreslerim</h3>
          {renderSavedAddresses()}
          
          <button
            onClick={handleNewAddress}
            className="flex items-center text-orange-500 hover:text-orange-700 font-medium"
          >
            <FaPlus className="mr-2" />
            Yeni Adres Ekle
          </button>
        </div>
      )}
      
      {(showAddressForm || savedAddresses.length === 0) && renderAddressForm()}
      
      {showAddressForm && savedAddresses.length > 0 && (
        <button
          onClick={() => setShowAddressForm(false)}
          className="mt-3 text-gray-500 hover:text-gray-700"
        >
          Kayıtlı adreslerimi göster
        </button>
      )}
    </div>
  );

  const renderShippingStep = () => (
    <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
      <div className="flex items-center mb-6">
        <FaTruck className="text-orange-500 mr-2" />
        <h2 className="text-xl font-semibold">Kargo Seçimi</h2>
      </div>
      
      {shippingCalculating ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Kargo fiyatları hesaplanıyor...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                formData.selectedShipping === option.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:border-orange-300'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, selectedShipping: option.id }))}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="selectedShipping"
                    value={option.id}
                    checked={formData.selectedShipping === option.id}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{option.name}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-1" />
                          {option.estimatedDays} iş günü
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          ₺{option.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 ml-8">
                <div className="flex flex-wrap gap-2">
                  {option.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <FaShieldAlt className="text-blue-500 mr-2" />
              <div>
                <h4 className="font-semibold text-blue-800">Kargo Güvencesi</h4>
                <p className="text-sm text-blue-700">
                  Tüm kargo gönderileriniz takip numarasıyla güvence altındadır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
      <div className="flex items-center mb-4">
        <FaCreditCard className="text-orange-500 mr-2" />
        <h2 className="text-xl font-semibold">Ödeme Bilgileri</h2>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center mb-2">
          <input
            type="radio"
            name="paymentMethod"
            value="credit-card"
            checked={formData.paymentMethod === 'credit-card'}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span>Kredi/Banka Kartı</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            name="paymentMethod"
            value="bank-transfer"
            checked={formData.paymentMethod === 'bank-transfer'}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span>Havale/EFT</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="cash-on-delivery"
            checked={formData.paymentMethod === 'cash-on-delivery'}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span>Kapıda Ödeme</span>
        </label>
      </div>

      {formData.paymentMethod === 'credit-card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="cardHolder"
            placeholder="Kart Üzerindeki İsim"
            value={formData.cardHolder}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 md:col-span-2"
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Kart Numarası"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 md:col-span-2"
            maxLength="19"
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleExpiryChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            maxLength="5"
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            maxLength="3"
          />
        </div>
      )}
    </div>
  );

  const renderConfirmationStep = () => {
    const selectedAddress = selectedAddressId 
      ? savedAddresses.find(addr => addr.id === selectedAddressId)
      : null;

    const addressInfo = selectedAddress || {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      district: formData.district,
      city: formData.city,
      phone: formData.phone
    };

    const selectedShipping = shippingOptions.find(option => option.id === formData.selectedShipping);

    return (
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-orange-500 mr-2" />
          <h2 className="text-xl font-semibold">Sipariş Özeti</h2>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Teslimat Adresi:</h3>
          <div className="bg-gray-50 p-3 rounded">
            {selectedAddress && (
              <p className="text-sm text-orange-600 font-medium mb-1">
                {selectedAddress.title}
              </p>
            )}
            <p className="text-gray-600">
              {addressInfo.firstName} {addressInfo.lastName}<br />
              {addressInfo.address}<br />
              {addressInfo.district}, {addressInfo.city}<br />
              {addressInfo.phone}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Kargo Seçimi:</h3>
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-2">{selectedShipping?.icon}</span>
                <div>
                  <p className="font-medium">{selectedShipping?.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedShipping?.estimatedDays} iş günü
                  </p>
                </div>
              </div>
              <span className="font-bold text-orange-600">
                ₺{selectedShipping?.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Ödeme Yöntemi:</h3>
          <p className="text-gray-600">
            {formData.paymentMethod === 'credit-card' && 'Kredi/Banka Kartı'}
            {formData.paymentMethod === 'bank-transfer' && 'Havale/EFT'}
            {formData.paymentMethod === 'cash-on-delivery' && 'Kapıda Ödeme'}
          </p>
        </div>
      </div>
    );
  };

  const renderOrderSummary = () => {
    const selectedShipping = shippingOptions.find(option => option.id === formData.selectedShipping);
    
    return (
      <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
        <h3 className="text-lg font-semibold mb-4">Sipariş Özeti</h3>
        
        <div className="space-y-2 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>₺{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Ara Toplam:</span>
            <span>₺{getTotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Kargo ({selectedShipping?.name || 'Seçilmedi'}):</span>
            <span>₺{getSelectedShippingPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Toplam:</span>
            <span className="text-orange-600">₺{getFinalTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sipariş Tamamla</h1>
        <button
          onClick={handleBackToCart}
          className="text-orange-500 hover:text-orange-700 underline"
        >
          Sepete Dön
        </button>
      </div>

      {renderStepIndicator()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && renderAddressStep()}
          {currentStep === 2 && renderShippingStep()}
          {currentStep === 3 && renderPaymentStep()}
          {currentStep === 4 && renderConfirmationStep()}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100"
              >
                Geri
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ml-auto"
                disabled={shippingCalculating}
              >
                {shippingCalculating ? 'Hesaplanıyor...' : 'Devam Et'}
              </button>
            ) : (
              <button
                onClick={handleCompleteOrder}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
              >
                Siparişi Tamamla
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;