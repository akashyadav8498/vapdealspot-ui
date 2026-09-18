import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/configurations/components/ui/input";
import { Button } from "@/configurations/components/ui/button";
import { Textarea } from "@/configurations/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/configurations/components/ui/select";
import { useNavigate } from "react-router-dom";
import { generateSlug } from "@/configurations/lib/slug";
import type { Product, Offer } from "@/configurations/lib/types";
import { useProducts } from "@/configurations/lib/ProductContext";
import { Trash2, Plus, X } from "lucide-react";
import { useState } from "react";

const variantSchema = z.object({
  id: z.string(),
  sku: z.string().min(1, "SKU is required"),
  attributes: z.record(z.string()),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  image: z.string().optional()
});

const offerSchema = z.object({
  id: z.string().optional(),
  merchant: z.string().min(1, "Merchant is required"),
  merchantLogo: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
  originalPrice: z.coerce.number().positive().optional().or(z.literal('')),
  affiliateUrl: z.string().url("Must be a valid URL").min(1, "URL is required"),
  availability: z.enum(["in_stock", "out_of_stock", "unknown"]),
  shippingInfo: z.string().optional()
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  shortDescription: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  
  featuredImage: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  galleryImages: z.array(z.string().url()),
  
  status: z.enum(["active", "inactive"]),
  featured: z.boolean(),
  trending: z.boolean(),
  showOnHomepage: z.boolean(),
  
  variants: z.array(variantSchema),
  offers: z.array(offerSchema),
  relatedProductIds: z.array(z.string())
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const { addProduct, updateProduct } = useProducts();
  const [tagInput, setTagInput] = useState("");

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
      shortDescription: initialData.shortDescription || "",
      description: initialData.description,
      category: initialData.category,
      tags: initialData.tags || [],
      seoMetaTitle: initialData.seoMetaTitle || "",
      seoMetaDescription: initialData.seoMetaDescription || "",
      featuredImage: initialData.featuredImage || (initialData as any).image || "",
      galleryImages: initialData.galleryImages || [],
      status: initialData.status,
      featured: initialData.featured || false,
      trending: initialData.trending || false,
      showOnHomepage: initialData.showOnHomepage || false,
      variants: initialData.variants || [],
      relatedProductIds: initialData.relatedProductIds || [],
      offers: (initialData.offers && initialData.offers.length > 0) ? initialData.offers : [
        { merchant: "", price: 0, affiliateUrl: "", availability: "in_stock" }
      ],
    } : {
      name: "",
      brand: "",
      shortDescription: "",
      description: "",
      category: "",
      tags: [],
      seoMetaTitle: "",
      seoMetaDescription: "",
      featuredImage: "",
      galleryImages: [],
      status: "active",
      featured: false,
      trending: false,
      showOnHomepage: false,
      variants: [],
      relatedProductIds: [],
      offers: [
        { merchant: "", price: 0, affiliateUrl: "", availability: "in_stock" }
      ],
    },
  });

  const { fields: offerFields, append: appendOffer, remove: removeOffer } = useFieldArray({
    name: "offers",
    control,
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    name: "variants",
    control,
  });

  const categoryValue = watch("category");
  const statusValue = watch("status");
  const tagsValue = watch("tags") || [];
  const featured = watch("featured");
  const trending = watch("trending");
  const showOnHomepage = watch("showOnHomepage");
  const currentOffers = watch("offers");

  const onSubmit = (data: ProductFormValues) => {
    const generatedSlug = generateSlug(data.brand, data.name);
    
    const finalOffers: Offer[] = data.offers.map((offer) => ({
      ...offer,
      id: offer.id || crypto.randomUUID(),
      originalPrice: offer.originalPrice ? Number(offer.originalPrice) : undefined,
    })) as Offer[];

    const finalProduct: Product = {
      ...(data as any),
      id: initialData?.id || crypto.randomUUID(),
      slug: initialData?.slug || generatedSlug,
      rating: initialData?.rating || 0,
      offers: finalOffers,
    };

    if (initialData) {
      updateProduct(initialData.id, finalProduct);
    } else {
      addProduct(finalProduct);
    }
    navigate("/admin/products");
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tagsValue.includes(newTag)) {
        setValue("tags", [...tagsValue, newTag], { shouldValidate: true });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", tagsValue.filter(t => t !== tagToRemove), { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-4xl pb-24">
      {/* General Information */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-xl font-semibold">General Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input {...register("name")} />
              {errors.name && <p className="text-[13px] text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <Input {...register("brand")} />
              {errors.brand && <p className="text-[13px] text-destructive">{errors.brand.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <SelectItem value="Devices">Devices</SelectItem>
                  <SelectItem value="Tanks">Tanks</SelectItem>
                  <SelectItem value="E-Liquids">E-Liquids</SelectItem>
                  <SelectItem value="CBD / THC">CBD / THC</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-[13px] text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <Input {...register("shortDescription")} placeholder="A brief summary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Description</label>
            <Textarea {...register("description")} rows={4} />
            {errors.description && <p className="text-[13px] text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <Input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter to add tags"
              />
              <Button type="button" onClick={handleAddTag}>Add</Button>
            </div>
            {tagsValue.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tagsValue.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-xl font-semibold">SEO & Meta</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Title</label>
            <Input {...register("seoMetaTitle")} placeholder="Default uses Product Name if empty" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Description</label>
            <Textarea {...register("seoMetaDescription")} rows={2} placeholder="Default uses Short Description if empty" />
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-xl font-semibold">Media</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image URL</label>
            <Input type="url" {...register("featuredImage")} />
            {errors.featuredImage && <p className="text-[13px] text-destructive">{errors.featuredImage.message}</p>}
          </div>
          {/* Note: Gallery images skipped for simplicity in Phase 1 if not strictly required, but field is modeled. */}
        </div>
      </section>

      {/* Product Variants */}
      <section className="space-y-6">
        <div className="border-b pb-2 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Variants</h2>
          <span className="text-sm text-muted-foreground">{variantFields.length} variant(s)</span>
        </div>
        
        <div className="space-y-4">
          {variantFields.map((field, index) => {
            const vError = errors.variants?.[index];
            return (
              <div key={field.id} className="relative p-5 border rounded-lg bg-card shadow-sm space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <input type="hidden" {...register(`variants.${index}.id` as const)} />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU</label>
                    <Input {...register(`variants.${index}.sku` as const)} />
                    {vError?.sku && <p className="text-[13px] text-destructive">{vError.sku.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (USD)</label>
                    <Input type="number" step="0.01" {...register(`variants.${index}.price` as const)} />
                    {vError?.price && <p className="text-[13px] text-destructive">{vError.price.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Level</label>
                    <Input type="number" {...register(`variants.${index}.stock` as const)} />
                    {vError?.stock && <p className="text-[13px] text-destructive">{vError.stock.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL (Optional)</label>
                    <Input type="url" {...register(`variants.${index}.image` as const)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Options (JSON format)</label>
                    <Input 
                      placeholder='e.g., {"Color": "Red", "Size": "L"}'
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value || "{}");
                          setValue(`variants.${index}.attributes` as const, parsed);
                        } catch(err) {
                          // Ignore invalid JSON while typing
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Type raw JSON mapping for Phase 1 MVP.</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => appendVariant({ id: crypto.randomUUID(), sku: "", attributes: {}, price: 0, stock: 0 })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Variant
        </Button>
      </section>

      {/* Retailer Offers */}
      <section className="space-y-6">
        <div className="border-b pb-2 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Retailer Offers</h2>
          <span className="text-sm text-muted-foreground">{offerFields.length} offer(s)</span>
        </div>
        
        <div className="space-y-4">
          {offerFields.map((field, index) => {
            const offerError = errors.offers?.[index];
            const watchPrice = currentOffers?.[index]?.price || 0;
            const watchOriginal = currentOffers?.[index]?.originalPrice;
            const showWarning = watchOriginal && Number(watchOriginal) > 0 && Number(watchOriginal) < Number(watchPrice);
            
            return (
              <div key={field.id} className="relative p-5 border rounded-lg bg-card shadow-sm space-y-4">
                {offerFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeOffer(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <input type="hidden" {...register(`offers.${index}.id` as const)} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Merchant</label>
                    <Input {...register(`offers.${index}.merchant` as const)} />
                    {offerError?.merchant && <p className="text-[13px] text-destructive">{offerError.merchant.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Merchant Logo URL</label>
                    <Input type="url" {...register(`offers.${index}.merchantLogo` as const)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (USD)</label>
                    <Input type="number" step="0.01" {...register(`offers.${index}.price` as const)} />
                    {offerError?.price && <p className="text-[13px] text-destructive">{offerError.price.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Original Price</label>
                    <Input type="number" step="0.01" {...register(`offers.${index}.originalPrice` as const)} />
                    {offerError?.originalPrice && <p className="text-[13px] text-destructive">{offerError.originalPrice.message}</p>}
                    {showWarning && !offerError?.originalPrice && (
                      <p className="text-[13px] text-amber-600 dark:text-amber-500">Original price is lower than current.</p>
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
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Affiliate URL</label>
                    <Input type="url" {...register(`offers.${index}.affiliateUrl` as const)} />
                    {offerError?.affiliateUrl && <p className="text-[13px] text-destructive">{offerError.affiliateUrl.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shipping Info</label>
                    <Input {...register(`offers.${index}.shippingInfo` as const)} placeholder="e.g., Free Shipping over $50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => appendOffer({ merchant: "", price: 0, affiliateUrl: "", availability: "in_stock" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Offer
        </Button>
        {errors.offers?.message && (
          <p className="text-[13px] text-destructive text-center">{errors.offers.message}</p>
        )}
      </section>

      {/* Settings */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
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
          </div>
          
          <div className="space-y-4 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" checked={featured} onChange={(e) => setValue("featured", e.target.checked)} />
              <span className="text-sm font-medium">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" checked={trending} onChange={(e) => setValue("trending", e.target.checked)} />
              <span className="text-sm font-medium">Trending Store Deal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary" checked={showOnHomepage} onChange={(e) => setValue("showOnHomepage", e.target.checked)} />
              <span className="text-sm font-medium">Show on Homepage</span>
            </label>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-4 z-10 lg:left-60 lg:pl-6">
        <div className="max-w-4xl flex items-center justify-end gap-4">
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
      </div>
    </form>
  );
}
