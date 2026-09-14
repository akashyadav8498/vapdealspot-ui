import { useRef, useState } from 'react';
import type { Contact } from '@/admin/lib/email/types';
import { Button } from '@/admin/components/ui/button';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

type CsvImportButtonProps = {
  onImport: (contacts: Omit<Contact, 'id' | 'createdAt'>[]) => { imported: number; duplicates: number; invalid: number };
};

export function CsvImportButton({ onImport }: CsvImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('Reading file...');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet);

        const parsedContacts: Omit<Contact, 'id' | 'createdAt'>[] = [];
        
        jsonData.forEach((row) => {
          // Flexible mapping
          const email = row.Email || row.email || row.EMAIL;
          parsedContacts.push({
            email: typeof email === 'string' ? email : '',
            firstName: row.FirstName || row.first_name || row['First Name'] || '',
            lastName: row.LastName || row.last_name || row['Last Name'] || '',
            isSubscribed: true,
          });
        });

        const result = onImport(parsedContacts);
        
        // Detailed feedback alert
        const msg = [];
        if (result.imported > 0) msg.push(`Imported ${result.imported} new contacts.`);
        if (result.duplicates > 0) msg.push(`Skipped ${result.duplicates} duplicate emails.`);
        if (result.invalid > 0) msg.push(`Skipped ${result.invalid} invalid or empty rows.`);
        
        if (msg.length === 0) {
          alert('No valid contacts found in the file.');
        } else {
          alert(msg.join('\\n'));
        }
        
        setImportStatus(null);
      } catch (err) {
        console.error(err);
        alert('Failed to parse CSV file. Please ensure it is a valid CSV or Excel file.');
        setImportStatus(null);
      }
    };
    
    reader.onerror = () => {
      alert('Failed to read file.');
      setImportStatus(null);
    };

    reader.readAsArrayBuffer(file);
    
    // Reset input to allow importing the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv, .xlsx"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        disabled={importStatus !== null}
      >
        <Upload className="w-4 h-4 mr-2" />
        {importStatus || 'Import CSV'}
      </Button>
    </>
  );
}
