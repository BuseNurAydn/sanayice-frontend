import { useState } from "react";
import { FaTruck, FaSearch } from "react-icons/fa";

export default function CargoTracking() {
    // Kargo takip numarasını ve firma seçimini tutacak state'ler
    const [trackingNumber, setTrackingNumber] = useState("");
    const [cargoCompany, setCargoCompany] = useState("ptt"); // Varsayılan PTT

    // Kargo firmalarının takip URL'leri (doğrudan takip numarası içermez)
    const pttUrl = "https://gonderitakip.ptt.gov.tr/";
    const yurticiUrl = "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula";

    const handleTracking = () => {
        const no = trackingNumber.trim();

        if (!no) {
            alert("Lütfen kargo takip numarasını giriniz.");
            return;
        }

        let redirectUrl = "";
        let alertMessage = `Kargo takip numaranız: ${no}\nLütfen açılacak sayfada bu numarayı ilgili alana yapıştırınız.`;

        if (cargoCompany === "ptt") {
            redirectUrl = pttUrl;
            alertMessage = `PTT Kargo takip sayfasına yönlendiriliyorsunuz.\n${alertMessage}`;
        } else if (cargoCompany === "yurtici") {
            redirectUrl = yurticiUrl;
            alertMessage = `Yurtiçi Kargo takip sayfasına yönlendiriliyorsunuz.\n${alertMessage}`;
        } else {
            alert("Geçersiz kargo firması seçimi.");
            return;
        }

        // Kullanıcıya numarayı kopyalaması için uyarı gösterelim
        // Çünkü kargo firmalarının sayfaları direkt URL'den sorgulama yapmaya izin vermeyebilir.
        alert(alertMessage);

        // Yeni sekmede yönlendirme yap
        window.open(redirectUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start pt-8">
            <div className="bg-white shadow-xl rounded p-8 w-full max-w-lg space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FaTruck className="text-orange-500" /> Kargo Takip Sorgulama
                </h2>
                
                <p className="text-gray-600">
                    Lütfen kargonuzun takip numarasını ve gönderi yapılan firmayı seçerek sorgulama yapın.
                </p>

                {/* Kargo Takip Formu */}
                <div className="space-y-4">
                    
                    {/* Kargo Firması Seçimi */}
                    <div>
                        <label htmlFor="cargo-company" className="block text-sm font-medium text-gray-700 mb-1">
                            Kargo Firması
                        </label>
                        <select
                            id="cargo-company"
                            value={cargoCompany}
                            onChange={(e) => setCargoCompany(e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 transition duration-150 outline-none"
                        >
                            <option value="ptt">PTT Kargo</option>
                            <option value="yurtici">Yurtiçi Kargo</option>
                        </select>
                    </div>

                    {/* Takip Numarası Girişi */}
                    <div>
                        <label htmlFor="tracking-number" className="block text-sm font-medium text-gray-700 mb-1">
                            Kargo Takip Numarası
                        </label>
                        <input
                            type="text"
                            id="tracking-number"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Örn: KN123456789TR"
                            className="w-full border-2 border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500 transition duration-150 outline-none"
                        />
                    </div>

                    {/* Sorgula Butonu */}
                    <button
                        onClick={handleTracking}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition duration-150 shadow-md"
                    >
                        <FaSearch /> Sorgula
                    </button>
                </div>

                <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <p>Kargo takibi, ilgili kargo firmasının kargo takip ekranı üzerinden yapılacaktır.</p>
                </div>
            </div>
        </div>
    );
}