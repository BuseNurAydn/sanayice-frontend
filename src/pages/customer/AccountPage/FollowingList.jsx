import { useEffect, useState } from "react";
import { getFollowing, unfollowSeller } from "../../../services/authService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const FollowingList = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const data = await getFollowing();
        setFollowing(data);
      } catch (err) {
        toast.error("Takip edilenler alınamadı");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, []);

  const handleUnfollow = async (sellerId) => {
    try {
      await unfollowSeller(sellerId);
      setFollowing((prev) => prev.filter((s) => s.sellerId !== sellerId));
      toast.info("Takipten çıkarıldı");
    } catch (err) {
      toast.error("Takipten çıkarılamadı");
    }
  };

  if (loading) return <p className="text-center py-20">Yükleniyor...</p>;
  if (!following.length) return <div className="text-center py-8 bg-gray-100">Henüz takip edilen satıcı yok.</div>;

  return (
     <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Takip Edilen Satıcılar</h2>
      <ul>
        {following.map((seller) => (
          <li key={seller.sellerId} className="flex items-center justify-between mb-4 p-2 bg-white shadow rounded">
            <div className="flex items-center gap-4">
              <img src={seller.profileImageUrl} alt={seller.companyName} className="w-16 h-16 rounded-full" />
              <div>
                <p className="font-semibold">{seller.companyName}</p>
                <p className="text-sm text-gray-500">{seller.followerCount} takipçi</p>
              </div>
            </div>
            <button
              onClick={() => handleUnfollow(seller.sellerId)}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              Takipten Çık
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowingList;
