import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/admin/components/ui/input";
import { Button } from "@/admin/components/ui/button";
import { Textarea } from "@/admin/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/admin/components/ui/select";
import { useNavigate } from "react-router-dom";
import { generateSlug } from "@/admin/lib/slug";
import type { Product, Offer } from "@/admin/lib/types";
import { useProducts } from "@/admin/lib/ProductContext";
import { Trash2, Plus } from "lucide-react";

const offerSchema = z.object({
  id: z.string().optional(),
  merchant: z.string().min(1, "Merchant is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  originalPrice: z.coerce.number().positive().optional().or(z.literal('')),
  affiliateUrl: z.string().url("Must be a valid URL").min(1, "URL is required"),
  availability: z.enum(["in_stock", "out_of_stock", "unknown"]),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  status: z.enum(["active", "inactive"]),
  offers: z.array(offerSchema).min(1, "At least one offer is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const { addProduct, updateProduct } = useProducts();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      name: initialData.name,
      brand: initialData.brand,
      description: initialData.description,
      category: initialData.category,
      image: initialData.image,
      status: initialData.status,
      offers: (initialData.offers && initialData.offers.length > 0) ? initialData.offers : [
        { merchant: "", price: 0, affiliateUrl: "", availability: "in_stock" }
      ],
    } : {
      name: "",
      brand: "",
      description: "",
      category: "",
      image: "",
      status: "active",
      offers: [
        { merchant: "", price: 0, affiliateUrl: "", availability: "in_stock" }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "offers",
    control,
  });

  const categoryValue = watch("category");
  const statusValue = watch("status");
  const currentOffers = watch("offers");

  const onSubmit = (data: ProductFormValues) => {
    // We are generating slug simply for compatibility in Phase 1 & 2
    const generatedSlug = generateSlug(data.brand, data.name);
    
    // Ensure all offers have an ID, preserving existing ones
    const finalOffers: Offer[] = data.offers.map((offer) => ({
      ...offer,
      id: offer.id || crypto.randomUUID(),
      originalPrice: offer.originalPrice ? Number(offer.originalPrice) : undefined,
    })) as Offer[];

    if (initialData) {
      updateProduct(initialData.id, {
        ...data,
        slug: initialData.slug || generatedSlug,
        offers: finalOffers,
      });
    } else {
      addProduct({
        id: crypto.randomUUID(),
        slug: generatedSlug,
        rating: 0,
        offers: finalOffers,
        name: data.name,
        brand: data.brand,
        description: data.description,
        category: data.category,
        image: data.image,
        status: data.status,
      });
    }
    navigate("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-[13px] text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Input {...register("brand")} />
            {errors.brand && (
              <p className="text-[13px] text-destructive">{errors.brand.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={categoryValue} 
              onValueChange={(val) => {
              if (val) setValue("category", val, { shouldValidate: true });
            }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Laptops">Laptops</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-[13px] text-destructive">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea {...register("description")} rows={4} />
          {errors.description && (
            <p className="text-[13px] text-destructive">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Offers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Offers</h3>
          <span className="text-sm text-muted-foreground">{fields.length} offer{fields.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-4">
          {fields.map((field, index) => {
            const offerError = errors.offers?.[index];
            const watchPrice = currentOffers?.[index]?.price || 0;
            const watchOriginal = currentOffers?.[index]?.originalPrice;
            const showWarning = watchOriginal && Number(watchOriginal) > 0 && Number(watchOriginal) < Number(watchPrice);
            
            return (
              <div key={field.id} className="relative p-4 border rounded-lg bg-card space-y-4">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <input type="hidden" {...register(`offers.${index}.id` as const)} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Merchant</label>
                    <Input {...register(`offers.${index}.merchant` as const)} />
                    {offerError?.merchant && (
                      <p className="text-[13px] text-destructive">{offerError.merchant.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Availability</label>
                    <Select 
                      value={currentOffers?.[index]?.availability || "in_stock"}
                      onValueChange={(val) => {
                        if (val) setValue(`offers.${index}.availability` as const, val as any, { shouldValidate: true });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    {offerError?.availability && (
                      <p className="text-[13px] text-destructive">{offerError.availability.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (USD)</label>
                    <Input type="number" step="0.01" {...register(`offers.${index}.price` as const)} />
                    {offerError?.price && (
                      <p className="text-[13px] text-destructive">{offerError.price.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Original Price (USD, Optional)</label>
                    <Input type="number" step="0.01" {...register(`offers.${index}.originalPrice` as const)} />
                    {offerError?.originalPrice && (
                      <p className="text-[13px] text-destructive">{offerError.originalPrice.message}</p>
                    )}
                    {showWarning && !offerError?.originalPrice && (
                      <p className="text-[13px] text-amber-600 dark:text-amber-500">Original price is lower than current price.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Affiliate URL</label>
                  <Input type="url" {...register(`offers.${index}.affiliateUrl` as const)} />
                  {offerError?.affiliateUrl && (
                    <p className="text-[13px] text-destructive">{offerError.affiliateUrl.message}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => append({ merchant: "", price: 0, affiliateUrl: "", availability: "in_stock" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Offer
        </Button>
        {errors.offers?.message && (
          <p className="text-[13px] text-destructive text-center">{errors.offers.message}</p>
        )}
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Media</h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Image URL</label>
          <Input type="url" {...register("image")} />
          {errors.image && (
            <p className="text-[13px] text-destructive">{errors.image.message}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Status</h3>
        
        <div className="space-y-2 w-full sm:w-[200px]">
          <Select 
            value={statusValue} 
            onValueChange={(val) => {
              if (val) setValue("status", val as "active" | "inactive", { shouldValidate: true });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-[13px] text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
