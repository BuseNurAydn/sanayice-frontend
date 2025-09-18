import { useState, useEffect } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { getProductQuestions, askProductQuestion } from "../services/productsService";
import { toast } from "react-toastify";

const SellerQuestions = ({ productId, autoOpenForm = false }) => {
  const [questions, setQuestions] = useState([]);
  const [showAskForm, setShowAskForm] = useState(false);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  //Soruları çekme
  useEffect(() => {
    if (autoOpenForm) setShowAskForm(true);
    const fetchQuestions = async () => {
      setLoading(true);
      const data = await getProductQuestions(productId);
      setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, [productId, autoOpenForm]);

  //Soru sorma
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!topic || !description) return;

    const fullQuestion = `${topic}: ${description}`;

    try {
      const newQuestion = await askProductQuestion(productId, fullQuestion);
      setQuestions([...questions, newQuestion]);
      setTopic("");
      setDescription("");
      setShowAskForm(false);
      toast.success("Soru gönderildi");
    } catch (err) {
      toast.error("Soru gönderilemedi");
    }
  };

  return (
    <div className="transition-all duration-500 ease-in-out max-w-6xl">
      {/* Sorular */}
      <div className="flex-1 max-w-4xl relative space-y-4">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-2">
            <FaEnvelopeOpenText className="text-6xl text-gray-400" />
            <p className="text-gray-500 italic">Henüz bir soru bulunmuyor.</p>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={idx} className="pb-2">
              <p className="font-medium text-gray-900">{q.questionText}</p>

              {q.answerText ? (
                <div className="mt-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <p className="text-gray-800">{q.answerText}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-blue-600">
                      {q.sellerName || "Satıcı"}
                    </span>{" "}
                    tarafından cevaplandı
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{q.createdAt}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-1">
                  Henüz cevaplanmadı
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form */}
      {showAskForm && (
        <div className="w-full mt-4 max-w-4xl">
          <form onSubmit={handleAskQuestion} className="space-y-3">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="border border-gray-200 outline-none rounded-lg px-4 py-2 w-full"
              required
            >
              <option value="">Konu Seçiniz</option>
              <option value="Ürün Özellikleri">Ürün Özellikleri</option>
              <option value="Teslimat ve Kargo">Teslimat ve Kargo</option>
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sorunuzu buraya yazın..."
              className="border rounded-lg px-4 py-2 w-full border-gray-200 outline-none"
              rows={4}
              required
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Gönder
            </button>
          </form>
        </div>
      )}

      {/* Üstteki Satıcıya Sor butonu */}
      <div className="flex justify-end mt-2">
        <button
          onClick={() => setShowAskForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          Satıcıya Soru Sor
        </button>
      </div>
    </div>
  );
};

export default SellerQuestions;
