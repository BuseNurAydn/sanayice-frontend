import { useState, useEffect } from "react";
import { rateSeller, getSellerRatings } from "../../services/authService";

const SellerReviews = ({ sellerId }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getSellerRatings(sellerId);
                setReviews(data);
                console.log(data)
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchReviews();
    }, [sellerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !comment.trim()) return alert("Puan ve yorum gerekli!");

        try {
            const newReview = await rateSeller({ sellerId, rating, comment });

            // backend yeni yorumu dönüyorsa direkt ekle
            setReviews([newReview, ...reviews]);

            setRating(0);
            setComment("");
        } catch (error) {
            alert(error.message);
        }
    };

    // Ortalama puan
    const average =
        reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

    // Yıldız dağılımı
    const starCounts = [5, 4, 3, 2, 1].map(
        (s) => reviews.filter((r) => r.rating === s).length
    );

    return (
        <div className="">
            {/* Ortalama Puan Kutusu */}
            <div className="flex gap-8 items-center bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg">
                <div className="text-center">
                    <div className="text-4xl font-bold">{average}</div>
                    <div className="text-yellow-500 text-xl">
                        {"★".repeat(Math.round(average))}{"☆".repeat(5 - Math.round(average))}
                    </div>
                    <p className="text-gray-500 text-sm">{reviews.length} kişi yorum yaptı</p>
                </div>
                <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((s, idx) => (
                        <div key={s} className="flex items-center gap-2">
                            <span className="w-6">{s}★</span>
                            <div className="flex-1 bg-gray-200 rounded h-2">
                                <div
                                    className="bg-yellow-400 h-2 rounded"
                                    style={{
                                        width:
                                            reviews.length > 0
                                                ? `${(starCounts[idx] / reviews.length) * 100}%`
                                                : "0%",
                                    }}
                                />
                            </div>
                            <span className="w-8 text-sm text-gray-600">{starCounts[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Yorum Listesi */}
            <div className="space-y-4 mb-6 bg-white p-4 md:p-8 rounded-lg">
                {/* Üst bar: toplam yorum ve sıralama */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-700">
                        {reviews.length} kişi bu satıcıya yorum yaptı
                    </p>

                    <select
                        className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onChange={(e) => {
                            const value = e.target.value;
                            let sorted = [...reviews];
                            if (value === "highest") {
                                sorted.sort((a, b) => b.rating - a.rating);
                            } else if (value === "lowest") {
                                sorted.sort((a, b) => a.rating - b.rating);
                            } else if (value === "newest") {
                                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                            }
                            setReviews(sorted);
                        }}
                    >
                        <option value="newest">En Yeni</option>
                        <option value="highest">En Yüksek Puan</option>
                        <option value="lowest">En Düşük Puan</option>
                    </select>
                </div>

                {reviews.map((r) => (
                    <div key={r.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-center py-2">
                            <div>
                                <p className="text-gray-700 py-1">{r.comment}</p>
                                <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(r.updatedAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex items-center ">
                            {r.rater?.profileImageUrl && (
                                <img
                                    src={r.rater.profileImageUrl}
                                    alt={r.rater.name}
                                    className="w-12 h-12 rounded-full object-contain"
                                />
                            )}
                            <p className=" text-gray-700 font-medium">{r.rater?.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SellerReviews;

