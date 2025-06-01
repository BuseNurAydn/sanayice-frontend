// src/components/Contact.jsx
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { IoLogoYoutube } from 'react-icons/io';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handles changes to form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // In a real application, you would send this data to a backend API.
    // For demonstration purposes, we'll use a simple alert.
    // IMPORTANT: In a production app, replace `alert()` with a custom modal or toast notification.
    alert("Mesajınız başarıyla gönderildi!");
    setFormData({ name: '', email: '', message: '' }); // Clear the form after submission
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">İletişim</h2>

      {/* Main content grid for contact info and form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Contact Information Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Bize Ulaşın</h3>
          {/* Address */}
          <div className="flex items-center gap-3 text-gray-600">
            <FaMapMarkerAlt className="text-orange-600 text-xl" />
            <p>Sanayice Genel Merkez, İzmir, Türkiye</p>
          </div>
          {/* Phone Number */}
          <div className="flex items-center gap-3 text-gray-600">
            <FaPhone className="text-orange-600 text-xl" />
            <p>+90 555 123 45 67</p>
          </div>
          {/* Email Address */}
          <div className="flex items-center gap-3 text-gray-600">
            <FaEnvelope className="text-orange-600 text-xl" />
            <p>info@sanayice.com</p>
          </div>

          {/* Social Media Links */}
          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Bizi Takip Edin</h3>
          <div className="flex space-x-4 text-2xl">
            {/* Facebook Link */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <FaFacebook />
            </a>
            {/* Instagram Link */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <AiFillInstagram />
            </a>
            {/* YouTube Link */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <IoLogoYoutube />
            </a>
            {/* LinkedIn Link */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Mesaj Gönderin</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="örnek@eposta.com"
                required
              />
            </div>
            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Mesajınızı buraya yazın..."
                required
              ></textarea>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-orange-700 transition-colors duration-300 shadow-md"
            >
              Mesajı Gönder
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Konumumuz</h3>
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {/* Google Maps iframe - Replace the `src` with your actual location's embed code */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3125.8645063063544!2d27.20455351532822!3d38.46197177964177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd8b8e0e0e0e1%3A0x1234567890abcdef!2zS2F6xLFtIERpcmlrIE1haC4!5e0!3m2!1str!2str!4v1678901234567!5m2!1str!2str"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sanayice Konumu"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;