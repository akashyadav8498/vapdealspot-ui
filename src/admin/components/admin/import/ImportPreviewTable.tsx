import type { ImportResult } from "@/admin/lib/import/types";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/table";

export function ImportPreviewTable({ result }: { result: ImportResult }) {
  const displayRows = result.rows.slice(0, 50);
  const hasMore = result.rows.length > 50;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Data Preview</h3>
        {hasMore && (
          <span className="text-xs text-muted-foreground">
            Showing first 50 of {result.total} rows
          </span>
        )}
      </div>

      <div className="border rounded-lg bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Row</TableHead>
              <TableHead>Key</TableHead>
              <TableHead className="w-[180px]">Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((row) => {
              const hasErrors = row.issues.some((i) => i.severity === "error");
              
              return (
              <>
                <TableRow
                  key={row.rowNumber}
                  className={hasErrors ? "bg-destructive/5 hover:bg-destructive/10" : ""}
                >
                  <TableCell className="font-medium text-muted-foreground text-xs">
                    {row.rowNumber}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[100px] font-mono text-xs">{row.data.productKey}</span>
                    {row.issues.some(i => i.field === "productKey") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Req
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground truncate max-w-[150px]">
                      {row.data.name || <span className="text-muted-foreground italic">Missing name</span>}
                    </div>
                    {row.issues.some(i => i.field === "name") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Required
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[120px]">{row.data.brand}</span>
                    {row.issues.some(i => i.field === "brand") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Req
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[120px]">{row.data.category}</span>
                    {row.issues.some(i => i.field === "category") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Req
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.data.price !== undefined ? row.data.price : "-"}
                    {row.issues.some(i => i.field === "price") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Invalid
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[100px]">{row.data.merchant}</span>
                    {row.issues.some(i => i.field === "merchant") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Error
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[100px]">{row.data.availability || "Missing"}</span>
                    {row.issues.some(i => i.field === "availability") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Invalid
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.data.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : row.data.status === "inactive"
                          ? "bg-muted text-muted-foreground"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {row.data.status || "Missing"}
                    </span>
                    {row.issues.some(i => i.field === "status") && (
                      <div className="flex items-center gap-1 text-[11px] text-destructive mt-1">
                        <AlertCircle className="w-3 h-3" /> Invalid
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                {/* Render group-level error if present, directly under the row */}
                {row.issues.filter(i => !i.field).map((issue, idx) => (
                  <TableRow key={`${row.rowNumber}-err-${idx}`} className="bg-destructive/5 hover:bg-destructive/5">
                    <TableCell colSpan={9} className="py-2 text-xs text-destructive">
                       <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-semibold">Row {row.rowNumber} Validation Error:</span> {issue.message}
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {displayRows.some((row) => row.issues.length > 0) && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/20"></div>
          Rows with errors are highlighted and cannot be imported until fixed in the source file.
        </div>
      )}
    </div>
  );
}
