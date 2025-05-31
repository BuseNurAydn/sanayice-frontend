import { useSelector, useDispatch } from "react-redux";
import { changeQuantity, removeFromCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    //ödeme sayfasına yönlendirme
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sepetim</h1>
      {cartItems.length === 0 ? (
        <p>Sepetiniz boş</p>
      ) : (
        cartItems.map((item) => (
          <div
            key={item.id}
            className="flex border border-gray-300 rounded-lg p-4 mb-4 items-center relative"
          >
            {/* Sol: Görsel */}
            <div className="w-24 h-24 flex items-center justify-center mr-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-full border border-gray-300 object-contain"
              />
            </div>

            {/* Orta: Bilgiler */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-sm text-gray-500">{item.brand}</p>

              {/* Adet Kontrol */}
              <div className="flex items-center gap-4 mt-4 border border-[var(--color-dark-orange)] rounded-lg w-max px-2 py-1 shadow">
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      dispatch(changeQuantity({ id: item.id, delta: -1 }));
                    }
                  }}
                  className="flex items-center justify-center"
                  aria-label="Azalt"
                >
                  <span className="text-2xl font-bold select-none">−</span>
                </button>

                <span className="w-8 text-center font-semibold text-gray-700 select-none">
                  {item.quantity}
                </span>

                <button
                  onClick={() => dispatch(changeQuantity({ id: item.id, delta: 1 }))}
                  className=" flex items-center justify-center"
                  aria-label="Arttır"
                >
                  <span className="text-2xl font-bold select-none">+</span>
                </button>
              </div>

            </div>

            {/* Sağ: Fiyat ve Sil */}
            <div className="flex flex-col items-end space-y-2">
              <p className="text-orange-600 font-bold text-md">
                ₺{(item.price * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => {
                  dispatch(removeFromCart(item.id)),
                  toast.info("Ürün silindi");
                }}
                className="text-red-500 hover:text-red-700 underline"
              >
                <FaRegTrashCan />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Toplam */}
      {cartItems.length > 0 && (
        <>
          <div className="mt-6 text-right text-xl font-bold text-gray-800">
            Toplam: ₺{getTotal().toLocaleString()}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleContinueShopping}
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
            >
              Alışverişe Devam Et
            </button>
            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Alışverişi Tamamla
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

