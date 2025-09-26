import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OrderDetail from "./OrderDetail";
import { getStatus } from "../../../services/ordersService";
import { HiArrowLeft } from "react-icons/hi";

const DeliveredOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order) {
      getStatus("DELIVERED")
        .then((res) => {
          const singleOrder = res.data.find((o) => o.id === parseInt(id));
          setOrder(singleOrder);
        })
        .catch((err) => console.error(err));
    }
  }, [id, order]);



  return (
    <div className="p-4">
      <button
        onClick={() => navigate("/hesabim/siparislerim")}
        className="mb-4 text-sm font-semibold border border-gray-400 py-1 px-3 text-gray-700 hover:border-orange-600 hover:text-orange-600 rounded cursor-pointer"
      >
       <HiArrowLeft />
      </button>

      <OrderDetail 
        order={order} 
        openReviewModal={(item) => alert("Değerlendirme aç!")} 
      />
    </div>
  );
};

export default DeliveredOrderDetailPage;

