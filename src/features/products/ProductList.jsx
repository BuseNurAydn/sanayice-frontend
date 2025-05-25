// src/features/products/ProductList.jsx

import React from "react";
import ProductCard from "./ProductCard";
import { products } from "./ProductData";
import Htext from "../../shared/Text/HText";

const ProductList = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Htext>Ürünler</Htext>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
