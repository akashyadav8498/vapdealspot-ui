import { useAudience } from '../../../lib/email/useAudience';
import { ContactListTable } from '../../../components/admin/email/ContactListTable';
import { AddContactForm } from '../../../components/admin/email/AddContactForm';
import { CsvImportButton } from '../../../components/admin/email/CsvImportButton';

export function AudienceListPage() {
  const { contacts, addContact, toggleSubscription, importContacts } = useAudience();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Audience</h2>
          <p className="text-sm text-secondary-foreground">Manage your subscribers and contacts.</p>
        </div>
        <div className="flex items-center gap-2">
          <CsvImportButton onImport={importContacts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <AddContactForm onAddContact={addContact} />
        </div>

        <div className="lg:col-span-2">
          <ContactListTable 
            contacts={contacts} 
            onToggleSubscription={toggleSubscription} 
          />
        </div>
      </div>
    </div>
  );
}
