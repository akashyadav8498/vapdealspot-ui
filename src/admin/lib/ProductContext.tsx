import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "./types";
import { demoProducts } from "./data";

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  addProducts: (products: Product[]) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(demoProducts);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const addProducts = (newProducts: Product[]) => {
    setProducts((prev) => [...newProducts, ...prev]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, addProducts, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
