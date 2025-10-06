import { createSlice, createSelector } from '@reduxjs/toolkit';

// Başlangıç sabit veri
const initialNotifications = [
    { id: 1, text: "Yeni siparişiniz var", time: "2 dk önce", role: "ROLE_SELLER", isRead: false },
    { id: 2, text: "Profiliniz onaylandı", time: "1 saat önce", role: "ROLE_SELLER", isRead: true },
    { id: 3, text: "Ürününüzde yetersiz resim olduğu için reddedildi", time: "10 dakka önce", role: "ROLE_SELLER", isRead: false },
    { id: 4, text: "Ürününüz yayına alındı", time: "2 gün önce", role: "ROLE_SELLER", isRead: true },
    { id: 5, text: "Yeni bir satıcı başvurusu var", time: "1 saat önce", role: "ROLE_MANAGER", isRead: false },
    { id: 6, text: "Aylık satış raporu hazır", time: "Dün", role: "ROLE_MANAGER", isRead: false },
    { id: 7, text: "Sipariş teslim edildi", time: "1 saat önce", role: "ROLE_SELLER", isRead: false },
    { id: 8, text: "Yeni bir ürün onaya geldi", time: "30 dk önce", role: "ROLE_MANAGER", isRead: false },
    { id: 9, text: "Ödeme Başarılı", time: "1 hafta önce", role: "ROLE_SELLER", isRead: true },
];

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: initialNotifications,
    },
    reducers: {
        /** Tek bir bildirimi okundu yapar */
        markAsRead: (state, action) => {
            const idToUpdate = action.payload;
            const notification = state.items.find(n => n.id === idToUpdate);
            if (notification) {
                notification.isRead = true;
            }
        },
        /** Kullanıcının rolüne ait tüm okunmamış bildirimleri okundu yapar */
        markAllAsReadByRole: (state, action) => {
            const role = action.payload;
            state.items.forEach(n => {
                if (n.role === role && !n.isRead) {
                    n.isRead = true;
                }
            });
        },
        /** API'den bildirim listesini set eder */
        setNotifications: (state, action) => {
            state.items = action.payload;
        },
        // ekleme, silme action'ları
    },
});

export const { markAsRead, markAllAsReadByRole, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;


// Giriş Selector'ları 
const selectNotificationsItems = (state) => state.notifications.items;
const selectUserAuth = (state) => state.auth.user;

/**
 * Kullanıcı rolüne göre filtrelenmiş bildirimleri ve okunmamış sayısını döndürür.
 * createSelector sayesinde yalnızca state değiştiğinde yeniden hesaplanır.
 */
export const selectUserNotifications = createSelector(
    [selectNotificationsItems, selectUserAuth],
    (items, user) => {
        const userRole = user?.role;
        
        // Rol yoksa boş dön
        if (!userRole) {
            return { filteredNotifications: [], unreadCount: 0 };
        }

        // Rol bazında filtreleme ve Okunmamışları Üste Alma
        const filtered = items
            .filter(n => n.role === userRole)
            .sort((a, b) => (a.isRead ? 1 : -1) - (b.isRead ? 1 : -1)); 

        // Okunmamış Sayısını Hesaplama
        const unreadCount = filtered.filter(n => !n.isRead).length;

        // Memoize Edilmiş Çıktıyı Döndürme
        return { 
            filteredNotifications: filtered,
            unreadCount 
        };
    }
);