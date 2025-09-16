import { useState, useEffect } from "react";
import { FaEnvelopeOpenText } from "react-icons/fa";

const SellerQuestions = ({ autoOpenForm = false }) => {
  const [questions, setQuestions] = useState([
    {
      question: "Ürün orijinal mi?",
      answer: {
        text: "Ürün orijinaldir.",
        seller: "CNS GROUP",
        date: "26 Ağustos  56 dakika önce",
      },
    },
  ]);

  const [showAskForm, setShowAskForm] = useState(false);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingIndex, setReplyingIndex] = useState(null);

  useEffect(() => {
    if (autoOpenForm) setShowAskForm(true);
  }, [autoOpenForm]);

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!topic || !description) return;

    const fullQuestion = `${topic}: ${description}`;
    setQuestions([...questions, { question: fullQuestion, answer: null }]);
    setTopic("");
    setDescription("");
    setShowAskForm(false);
  };

  const handleReply = (index) => {
    if (!replyText) return;

    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = {
      text: replyText,
      seller: "CNS GROUP",
      date: new Date().toLocaleString("tr-TR", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setQuestions(updatedQuestions);
    setReplyText("");
    setReplyingIndex(null);
  };

  return (
    <div className="transition-all duration-500 ease-in-out max-w-6xl">
     

      {/* Sorular */}
      <div className="flex-1 max-w-4xl relative">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-2">
            <FaEnvelopeOpenText className="text-6xl text-gray-400" />
            <p className="text-gray-500 italic">Henüz bir soru bulunmuyor.</p>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div key={idx} className="pb-2">
              <p className="font-medium text-gray-900">{q.question}</p>

              {q.answer ? (
                <div className="mt-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <p className="text-gray-800">{q.answer.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-blue-600">{q.answer.seller}</span> satıcısı cevapladı
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{q.answer.date}</p>
                </div>
              ) : replyingIndex === idx ? (
                <div className="mt-1 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Cevabınızı yazın..."
                    className="border border-gray-200 rounded-lg px-4 py-2 w-full outline-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(idx)}
                      className="bg-[var(--color-dark-orange)] text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Cevapla
                    </button>
                    <button
                      onClick={() => setReplyingIndex(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingIndex(idx)}
                  className="mt-1 border text-[var(--color-dark-blue)] px-4 py-2 rounded-lg cursor-pointer font-medium"
                >
                  Cevap Yaz
                </button>
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
      <div className="flex justify-end">
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


