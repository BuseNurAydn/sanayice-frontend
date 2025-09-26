import { useState,useEffect } from "react";
import { FaBox, FaCheckCircle, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { FiEyeOff, FiEye } from "react-icons/fi";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Özel marker ikonu
const truckIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
    iconSize: [40, 40],
});

export default function CargoTracking() {
    const [tracking] = useState({
        company: "Mng Kargo",
        trackingNumber: "MNGX123456789",
        status: "Yolda",
        estimatedDelivery: "26.09.2025",
        sender: "ABC Mağazası",
        receiver: "Buse Nur Aydın",
        name: "Mng Kargo Şubesi - İstanbul, Kadıköy",
        address: "Moda Mahallesi Cumhuriyet Caddesi No: 10/A İstanbul/Kadıköy ",
        steps: [
            { label: "Gönderi Alındı", date: "20.09.2025", done: true },
            { label: "Gönderi Yolda", date: "21.09.2025", done: true },
            { label: "Transfer Sürecinde", date: "22.09.2025", done: true },
            { label: "Teslimat Şubesinde", date: "24.09.2025", done: true },
            { label: "Teslim Edildi", date: "Bekleniyor", done: false },
        ],
        products: [
            { name: "Kırmızı Elbise", qty: 1 },
            { name: "Siyah Çanta", qty: 1 },
        ],
    });

    const [position, setPosition] = useState([39.9208, 32.8541]); // Başlangıç Ankara
    const [showMap, setShowMap] = useState(true);

    // Animasyon: araç konum değişimi
    useEffect(() => {
        const path = [
            [39.9208, 32.8541], // Ankara
            [40.0, 32.5],
            [40.5, 31.8],
            [41.0, 30.5],
            [41.0082, 28.9784], // İstanbul
        ];
        let i = 0;
        const interval = setInterval(() => {
            setPosition(path[i]);
            i++;
            if (i >= path.length) clearInterval(interval);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
            <div className="bg-white shadow-xl rounded p-6 w-full max-w-4xl space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Kargo Takip</h2>


                {/* Genel Bilgiler */}
                <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded shadow-md">
                    <p><span className="font-semibold">Firma:</span> {tracking.company}</p>
                    <p><span className="font-semibold">Takip No:</span> {tracking.trackingNumber}</p>
                    <p><span className="font-semibold">Durum:</span> <span className="text-blue-600">{tracking.status}</span></p>
                    <p><span className="font-semibold">Tahmini Teslimat: </span> {tracking.estimatedDelivery}</p>
                </div>

                {/* Gönderici - Alıcı */}
                <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded shadow-md">
                    <div>
                        <h3 className="font-semibold mb-2">Gönderici</h3>
                        <p>{tracking.sender}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Alıcı</h3>
                        <p>{tracking.receiver}</p>
                        <p className="text-sm text-gray-500">{tracking.address}</p>
                    </div>
                </div>

                {/* Timeline*/}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Timeline */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Kargo Süreci</h3>
                        <div className="bg-gray-50 flex flex-col gap-4 p-4 rounded shadow-md">
                            {tracking.steps.map((step, idx) => (
                                <div key={idx} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 flex items-center justify-center rounded-full 
                  ${step.done ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                                    >
                                        {step.done ? <FaCheckCircle /> : <FaBox />}
                                    </div>
                                    <div className="ml-4">
                                        <p className={`font-medium ${step.done ? "text-gray-800" : "text-gray-500"}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-sm text-gray-400">{step.date}</p>
                                    </div>
                                    {idx < tracking.steps.length - 1 && (
                                        <div className="flex-1 border-t border-dashed border-gray-300 mx-4"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modern Kargo Bilgisi Kartı */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Teslimat Bilgisi</h3>

                        <div className="flex flex-col gap-26 bg-gray-50 p-4 rounded shadow-md">
                            {/* Teslimat Adresi */}
                            <div className="flex flex-col gap-2">
                                <p className="font-semibold text-gray-800">{tracking.name}</p>
                                <p className="text-sm text-gray-500">Adres</p>
                                <p className="font-semibold text-gray-700">{tracking.address}</p>
                            </div>

                            {/* Kargo İçeriği */}
                            <div>
                                <h4 className="font-semibold mb-1">Kargo İçeriği</h4>
                                <ul className="list-disc list-inside text-gray-700">
                                    {tracking.products.map((item, i) => (
                                        <li key={i}>
                                            {item.name} <span className="text-gray-500">({item.qty} adet)</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Harita Collapse */}
                <div className="mt-6">
                    {showMap && (
                        <div className="h-72 rounded overflow-hidden">
                            <MapContainer center={position} zoom={6} style={{ height: "100%", width: "100%" }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={position} icon={truckIcon}>
                                    <Popup>Kargonuz burada 🚚</Popup>
                                </Marker>
                                <Polyline positions={[[39.9208, 32.8541], [40.0, 32.5], [40.5, 31.8], [41.0, 30.5], [41.0082, 28.9784]]} color="blue" />
                            </MapContainer>
                        </div>
                    )}
                    <button
                        className="bg-gray-200 px-4 py-2 rounded my-2 hover:bg-gray-300 flex gap-2 items-center"
                        onClick={() => setShowMap(!showMap)}
                    >
                        {showMap ? (
                            <>
                                <FiEyeOff /> Haritayı Gizle
                            </>
                        ) : (
                            <>
                                <FiEye /> Haritayı Göster
                            </>
                        )}
                    </button>
                </div>

                {/* Destek */}
                <div className="flex justify-end mt-4">
                    <button className="flex items-center gap-2 bg-orange-500 px-4 py-2 text-white text-sm rounded hover:bg-orange-600 cursor-pointer">
                        <FaPhone /> Müşteri Hizmetleri
                    </button>
                </div>
            </div>
        </div>
    );
}
