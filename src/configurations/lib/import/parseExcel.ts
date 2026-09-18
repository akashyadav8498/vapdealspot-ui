import * as XLSX from "xlsx";
import type { ImportRow, ImportResult } from "./types";
import { validateImportRows } from "./validateImportRows";

const REQUIRED_COLUMNS = [
  "productKey",
  "name",
  "brand",
  "category",
  "description",
  "image",
  "status",
  "merchant",
  "price",
  "affiliateUrl",
  "availability",
];

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

export const parseExcelFile = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new FileValidationError("Could not read file data.");

        const workbook = XLSX.read(data, { type: "array" });
        if (workbook.SheetNames.length === 0) {
          throw new FileValidationError("No product rows found in this file.");
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Read headers explicitly
        const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });
        
        if (jsonRows.length === 0) {
          throw new FileValidationError("No product rows found in this file.");
        }

        const headers: string[] = (jsonRows[0] as string[]) || [];
        
        if (headers.length === 0) {
          throw new FileValidationError("No product rows found in this file.");
        }

        // File-level required column validation
        const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          throw new FileValidationError(`Missing required columns: ${missingColumns.join(", ")}`);
        }

        // File-level warnings
        const fileWarnings: string[] = [];
        const extraColumns = headers.filter(col => !REQUIRED_COLUMNS.includes(col));
        if (extraColumns.length > 0) {
          extraColumns.forEach(col => {
            if (col && String(col).trim()) {
               fileWarnings.push(`Unrecognized column: ${col}`);
            }
          });
        }

        if (jsonRows.length <= 1) {
          throw new FileValidationError("No product rows found in this file.");
        }

        // Read data as objects mapping headers to values
        const dataRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
        
        const importRows: ImportRow[] = dataRows.map(row => {
          return {
            productKey: row.productKey !== undefined ? String(row.productKey) : undefined,
            name: row.name !== undefined ? String(row.name) : undefined,
            brand: row.brand !== undefined ? String(row.brand) : undefined,
            category: row.category !== undefined ? String(row.category) : undefined,
            description: row.description !== undefined ? String(row.description) : undefined,
            image: row.image !== undefined ? String(row.image) : undefined,
            status: row.status !== undefined ? String(row.status) : undefined,
            merchant: row.merchant !== undefined ? String(row.merchant) : undefined,
            price: row.price,
            originalPrice: row.originalPrice,
            affiliateUrl: row.affiliateUrl !== undefined ? String(row.affiliateUrl) : undefined,
            availability: row.availability !== undefined ? String(row.availability) : undefined,
          };
        });

        const validatedRows = validateImportRows(importRows);
        
        let valid = 0;
        let warnings = 0;
        let errors = 0;

        validatedRows.forEach(row => {
          const hasError = row.issues.some(issue => issue.severity === "error");
          const hasWarning = row.issues.some(issue => issue.severity === "warning");
          
          if (hasError) errors++;
          if (hasWarning) warnings++;
          if (!hasError) valid++;
        });

        resolve({
          total: validatedRows.length,
          valid,
          warnings,
          errors,
          fileWarnings,
          rows: validatedRows
        });

      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new FileValidationError("Failed to read the file."));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const generateTemplate = () => {
  const ws = XLSX.utils.json_to_sheet([
    {
      productKey: "VDS-001",
      name: "Example Pod Device",
      brand: "VapeCo",
      category: "Devices",
      description: "A compact and reliable pod device for daily use.",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop",
      status: "active",
      merchant: "Amazon",
      price: 24.99,
      originalPrice: 29.99,
      affiliateUrl: "https://amazon.com/product",
      availability: "in_stock"
    },
    {
      productKey: "VDS-001",
      name: "Example Pod Device",
      brand: "VapeCo",
      category: "Devices",
      description: "A compact and reliable pod device for daily use.",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop",
      status: "active",
      merchant: "DirectVapor",
      price: 22.99,
      originalPrice: "",
      affiliateUrl: "https://directvapor.com/product",
      availability: "in_stock"
    }
  ]);
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  
  XLSX.writeFile(wb, "vds_product_template.xlsx");
};
