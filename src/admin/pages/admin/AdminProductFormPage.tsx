import { useParams } from "react-router-dom";
import { ProductForm } from "../../components/admin/ProductForm";
import { useProducts } from "@/admin/lib/ProductContext";

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  
  const isEditing = Boolean(id);
  const existingProduct = isEditing 
    ? products.find((p) => p.id === id) 
    : undefined;

  if (isEditing && !existingProduct) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card mt-6">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <p className="text-sm text-secondary-foreground">
            {isEditing
              ? `Update details for ${existingProduct?.name}`
              : "Create a new product to display on the store."}
          </p>
        </div>
      </div>
      <div className="bg-card border rounded-lg p-6">
        <ProductForm initialData={existingProduct} />
      </div>
    </div>
  );
}
