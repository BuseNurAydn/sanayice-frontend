import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, ShoppingCart, CheckCircle, Clock, User, FileText, Bell,CircleX  } from 'lucide-react';
import { markAsRead, markAllAsReadByRole, selectUserNotifications } from '../../store/notificationSlice';

// Bildirim türüne göre ikon
const getNotificationIcon = (text) => {
    if (text.includes("sipariş")) return { Icon: ShoppingCart, color: "text-blue-500" };
    if (text.includes("onaylandı") || text.includes("yayına alındı")) return { Icon: CheckCircle, color: "text-green-500" };
    if (text.includes("reddedildi")) return { Icon: CircleX , color: "text-purple-500" };
    if (text.includes("başvurusu")) return { Icon: User, color: "text-yellow-500" };
    if (text.includes("raporu")) return { Icon: FileText, color: "text-red-500" };
    return { Icon: Clock, color: "text-gray-500" };
};

// Bildirim Öğesi  //React.memo sayesinde sadece propları değiştiğinde yeniden render edilir 
const NotificationItem = React.memo(({ notification, onMarkAsRead }) => {
    const { id, text, time, isRead } = notification;
    const { Icon, color } = getNotificationIcon(text);

    const getBgColorClass = (colorClass) => {
        // "text-blue-500" -> "bg-blue-100" yapar
        return colorClass.replace('text-', 'bg-').replace('-500', '-100');
    };

    const handleClick = () => {
        if (!isRead) {
            onMarkAsRead(id);
        }
        // Yönlendirme gelebilir
    };

    return (
        <li
            className={`flex items-start p-4 border-b last:border-b-0 cursor-pointer transition-all ${isRead ? 'bg-white hover:bg-gray-50' : 'bg-orange-50 hover:bg-orange-100 font-semibold border-l-4 border-orange-500'
                }`}
            onClick={handleClick}
        >
            <div
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mr-3 text-lg ${color} ${getBgColorClass(color)}`}
            >
                {typeof Icon === 'string' ? <span>{Icon}</span> : <Icon className="w-5 h-5" />}
            </div>

            <div className='flex-grow'>
                <p className={isRead ? 'text-gray-700' : 'text-gray-900'}>{text}</p>
                <span className={`text-xs ${isRead ? 'text-gray-500' : 'text-orange-600'}`}>{time}</span>
            </div>
            {!isRead && (
                <div className="flex-shrink-0 ml-4 pt-2">
                    <span className="inline-block w-2.5 h-2.5 bg-orange-500 rounded-full shadow-md" title="Yeni"></span>
                </div>
            )}
        </li>
    );
});

// Ana Bileşen
const Notifications = () => {
    const dispatch = useDispatch();
    // Kullanıcı rolünü Redux'tan çek
    const user = useSelector(state => state.auth.user) || { role: 'ROLE_SELLER' };
    const role = user.role;

    // Redux'tan Güncel Veriyi Çekme (Başlık ile aynı selector)
    const { filteredNotifications: allFiltered, unreadCount } = useSelector(selectUserNotifications);
    const [activeTab, setActiveTab] = useState('all');

    // Filtreleme ve Hesaplamalar
    const displayedNotifications = useMemo(() => {
        if (activeTab === 'unread') {
            return allFiltered.filter(n => !n.isRead);
        }
        if (activeTab === 'read') {
            return allFiltered.filter(n => n.isRead);
        }
        // 'all' sekmesinde, Redux selector'dan gelen sıralanmış listeyi kullan
        return allFiltered;
    }, [allFiltered, activeTab]);

    // Tekil Bildirimi Okundu Yapma
    const handleMarkAsRead = (idToUpdate) => {
        dispatch(markAsRead(idToUpdate));
    };

    // TOPLU Okundu Yapma
    const handleMarkAllAsRead = () => {
        if (unreadCount === 0) return;
        dispatch(markAllAsReadByRole(role));
    };

    const tabs = [
        { id: 'all', label: 'Tümü', count: allFiltered.length },
        { id: 'unread', label: 'Okunmamışlar', count: unreadCount },
        { id: 'read', label: 'Okunmuşlar', count: allFiltered.length - unreadCount },
    ];

    const currentDisplayedCount = displayedNotifications.length;

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Bell className="w-7 h-7 mr-2 text-orange-500" /> Bildirimler
                </h1>
                <button
                    onClick={handleMarkAllAsRead}
                    className={`text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${unreadCount > 0 ? 'text-orange-600 hover:text-orange-700' : 'text-gray-500'}`}
                    disabled={unreadCount === 0}
                >
                    <CheckCircle className="w-4 h-4 inline-block mr-1 align-middle" /> Hepsini Okundu Yap
                </button>
            </div>

            {/* --- Sekme Navigasyonu (Tabs) --- */}
            <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl shadow-md overflow-hidden">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex-1 p-4 text-center text-sm font-medium transition-colors relative
              ${activeTab === tab.id
                                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'
                            }
            `}
                    >
                        {tab.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${tab.id === 'unread' && unreadCount > 0 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {tab.id === 'unread' ? unreadCount : tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* --- Bildirim Listesi */}
            {currentDisplayedCount === 0 ? (
                <div className="text-center bg-white p-10 rounded-xl shadow-md mt-4 border border-gray-100">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">
                        {activeTab === 'unread'
                            ? 'Okunmamış bildiriminiz yok.'
                            : 'Bu filtreye uygun bildirim bulunmamaktadır.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {displayedNotifications.map(n => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                onMarkAsRead={handleMarkAsRead} // Redux action'ı çağrılıyor
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default Notifications;