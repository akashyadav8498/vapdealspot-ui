import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/configurations/components/ui/button";
import { ProductTable } from '../components/ProductTable';
import { Input } from "@/configurations/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/configurations/components/ui/select";
import { PermissionGuard } from "@/configurations/lib/permissions/engine";

export function ConfigurationsProductsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Products</h2>
          <p className="text-sm text-secondary-foreground">Manage the products shown in the catalog.</p>
        </div>
        <PermissionGuard module="Products" submodule="Products" action="Create">
          <Button onClick={() => navigate("/admin/products/new")}>
            + Add Product
          </Button>
        </PermissionGuard>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={(val) => { if (val) setCategoryFilter(val); }}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Audio">Audio</SelectItem>
              <SelectItem value="Laptops">Laptops</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => { if (val) setStatusFilter(val); }}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductTable
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
      />
    </div>
  );
}
