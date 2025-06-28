import { useState,useEffect } from 'react';
import { FaStar, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/products/reviews/my-reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Değerlendirmeler alınamadı");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  const handleEditReview = (id) => {
    console.log(`Edit review with ID: ${id}`);
    // Implement logic to edit review
  };

  const handleDeleteReview = (id) => {
    console.log(`Delete review with ID: ${id}`);
    // Implement logic to delete review
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Değerlendirmelerim</h2>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start w-full md:w-3/4">
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-24 h-24 object-cover rounded-md border border-gray-100"
                />
                <div className="flex-1">
                  <p className="text-base text-gray-800 font-medium mb-1 break-words">
                    {review.productName}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                  </div>
                  <p className="text-gray-700 italic mb-2">"{review.comment}"</p>
                  <p className="text-sm text-gray-500">Tarih: {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleEditReview(review.id)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                  title="Değerlendirmeyi Düzenle"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                  title="Değerlendirmeyi Sil"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-base text-gray-500 italic mt-6 p-4 bg-gray-50 rounded-md">
            Henüz bir değerlendirmeniz bulunmamaktadır.
          </p>
        )}
      </div>
    </div>
  );
};
export default Reviews;