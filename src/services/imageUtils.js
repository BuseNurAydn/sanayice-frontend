// imageUtils.js - Resim sıkıştırma ve boyutlandırma fonksiyonları

/**
 * Resmi sıkıştırır ve boyutlandırır
 * @param {File} file - Sıkıştırılacak resim dosyası
 * @param {Object} options - Sıkıştırma seçenekleri
 * @returns {Promise<File>} - Sıkıştırılmış resim dosyası
 */
export const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
      // Varsayılan seçenekler
      const defaultOptions = {
        maxWidth: 1200,      // Maksimum genişlik
        maxHeight: 1200,     // Maksimum yükseklik
        quality: 0.8,        // Kalite (0.1 - 1.0)
        maxSizeMB: 1,        // Maksimum dosya boyutu (MB)
        format: 'image/jpeg' // Çıktı formatı
      };
  
      const config = { ...defaultOptions, ...options };
  
      // Dosya tipini kontrol et
      if (!file.type.startsWith('image/')) {
        reject(new Error('Geçersiz dosya tipi. Sadece resim dosyaları kabul edilir.'));
        return;
      }
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
  
      img.onload = () => {
        // Orijinal boyutlar
        const { width: originalWidth, height: originalHeight } = img;
  
        // Yeni boyutları hesapla (orantıyı koruyarak)
        let { width, height } = calculateNewDimensions(
          originalWidth, 
          originalHeight, 
          config.maxWidth, 
          config.maxHeight
        );
  
        // Canvas boyutunu ayarla
        canvas.width = width;
        canvas.height = height;
  
        // Resmi çiz (kaliteli resize için)
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
  
        // Kalite ile sıkıştır
        compressWithQuality(canvas, config, file.name)
          .then(resolve)
          .catch(reject);
      };
  
      img.onerror = () => {
        reject(new Error('Resim yüklenemedi'));
      };
  
      img.src = URL.createObjectURL(file);
    });
  };
  
  /**
   * Yeni boyutları hesaplar (orantıyı koruyarak)
   */
  const calculateNewDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
    let width = originalWidth;
    let height = originalHeight;
  
    // Genişlik kontrolü
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
  
    // Yükseklik kontrolü
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
  
    return { width: Math.round(width), height: Math.round(height) };
  };
  
  /**
   * Kalite ile sıkıştır ve boyut kontrol et
   */
  const compressWithQuality = (canvas, config, fileName) => {
    return new Promise((resolve, reject) => {
      let quality = config.quality;
      const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
  
      const tryCompress = (currentQuality) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Resim sıkıştırılamadı'));
            return;
          }
  
          // Boyut kontrolü
          if (blob.size <= maxSizeBytes || currentQuality <= 0.1) {
            // Dosya objesi oluştur
            const compressedFile = new File([blob], fileName, {
              type: config.format,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            // Kaliteyi düşür ve tekrar dene
            tryCompress(currentQuality - 0.1);
          }
        }, config.format, currentQuality);
      };
  
      tryCompress(quality);
    });
  };
  
  /**
   * Resim önizleme URL'i oluştur
   */
  export const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Geçersiz dosya tipi'));
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Dosya okunamadı'));
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * Dosya boyutunu formatla (KB, MB)
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Resim bilgilerini al
   */
  export const getImageInfo = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: formatFileSize(file.size),
          type: file.type,
          name: file.name
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };