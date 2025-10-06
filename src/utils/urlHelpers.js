// Slug Fonksiyonu
export function createSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

// Ürün URL Üretici
export function generateProductUrl(product) {
  if (!product || !product.id) {
    return '/';
  }
  
  const brandSlug = product.brand ? createSlug(product.brand) : 'marka';
  const productSlug = product.name ? createSlug(product.name) : 'urun';
  return `/${brandSlug}/${productSlug}-p-${product.id}`;
}

// Kategori URL Üretici
export function generateCategoryUrl(category) {

  if (!category || !category.id) {
    return '/';
  }
  const categorySlug = category.name? createSlug(category.name) : 'kategori';
  return `/${categorySlug}-x-g${category.id}`;
}

// Alt Kategori URL Üretici (GÜNCEL)
export function generateSubCategoryUrl(subcategory, category) {

    if (!subcategory || !subcategory.id) {
        return '/';
    }

    const categorySlug = category?.name ? createSlug(category.name) : 'kategori';
    const subcategorySlug = subcategory.name ? createSlug(subcategory.name) : 'altkategori';
    
    return `c/${categorySlug}/${subcategorySlug}-x-g${subcategory.id}`; 
}


