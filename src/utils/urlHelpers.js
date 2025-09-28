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
  const categorySlug = createSlug(category.name);
  return `/${categorySlug}-x-g${category.id}`;
}

// Alt Kategori URL Üretici
export function generateSubCategoryUrl(subcategory) {
  const categorySlug = createSlug(subcategory.categoryName);
  const subcategorySlug = createSlug(subcategory.subcategoryName);
  return `/${categorySlug}-${subcategorySlug}-x-g${subcategory.subcategoryId}`;
}

//  Örnek kullanım
export function exampleUsage(product) {
  const productURL = generateProductUrl(product);
  const categoryURL = generateCategoryUrl({ id: product.categoryId, name: product.categoryName });
  const subCategoryURL = generateSubCategoryUrl(product);

  console.log("Ürün URL:", productURL);
  console.log("Kategori URL:", categoryURL);
  console.log("Alt Kategori URL:", subCategoryURL);
}

