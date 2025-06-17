//ANASAYFA İÇİN
export const getProducts = async () => {
 
  const response = await fetch("/api/products", {
  });

  if (!response.ok) {
    throw new Error("Veri alınamadı");
  }

  return response.json();
};

//id


