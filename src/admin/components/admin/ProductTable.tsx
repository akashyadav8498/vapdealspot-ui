import { useState } from "react";
import { useProducts } from "@/admin/lib/ProductContext";
import { useNavigate } from "react-router-dom";
import { getLowestPrice } from "@/admin/lib/pricing";
import { formatCurrency } from "@/admin/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/admin/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/admin/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Power, PowerOff } from "lucide-react";
import type { Product } from "@/admin/lib/types";

interface ProductTableProps {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
}

export function ProductTable({
  searchQuery,
  categoryFilter,
  statusFilter,
}: ProductTableProps) {
  const { products, updateProduct } = useProducts();
  const navigate = useNavigate();
  const [productToToggle, setProductToToggle] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.offers?.[0]?.merchant || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = () => {
    if (productToToggle) {
      updateProduct(productToToggle.id, {
        status: productToToggle.status === "active" ? "inactive" : "active",
      });
      setProductToToggle(null);
    }
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">
        No products found matching your filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop & Tablet Table (Hidden on mobile) */}
      <div className="hidden sm:block border rounded-lg bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Lowest Price</TableHead>
              <TableHead>Offers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <span className="font-medium truncate max-w-[200px]">
                      {product.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {getLowestPrice(product) !== null ? formatCurrency(getLowestPrice(product)!) : "Unavailable"}
                </TableCell>
                <TableCell>{product.offers?.length || 0} offers</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setProductToToggle(product)}
                        className={
                          product.status === "active"
                            ? "text-destructive focus:text-destructive"
                            : ""
                        }
                      >
                        {product.status === "active" ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List (Hidden on tablet/desktop) */}
      <div className="grid gap-3 sm:hidden">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg bg-card p-3 flex gap-3 shadow-sm">
            {/* Thumbnail */}
            <div className="w-[72px] h-[72px] rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="font-medium text-[13px] text-foreground leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {product.brand} &middot; {product.category}
                  </p>
                </div>
                
                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-accent hover:text-accent-foreground flex-shrink-0 -mr-1 -mt-1 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setProductToToggle(product)}
                      className={
                        product.status === "active"
                          ? "text-destructive focus:text-destructive"
                          : ""
                      }
                    >
                      {product.status === "active" ? (
                        <>
                          <PowerOff className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between items-end mt-2">
                <span className="font-semibold text-sm text-foreground">
                  {getLowestPrice(product) !== null ? formatCurrency(getLowestPrice(product)!) : "Unavailable"}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    product.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {product.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!productToToggle}
        onOpenChange={(open) => !open && setProductToToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {productToToggle?.status === "active"
                ? "Deactivate Product"
                : "Activate Product"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {productToToggle?.status === "active" ? "deactivate" : "activate"}{" "}
              <span className="font-semibold text-foreground">
                {productToToggle?.name}
              </span>
              ?
              {productToToggle?.status === "active" &&
                " This will hide the product from the customer catalog."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={
                productToToggle?.status === "active"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {productToToggle?.status === "active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
