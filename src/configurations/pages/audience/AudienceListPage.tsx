import { useAudience } from '../../lib/email/useAudience';
import { ContactListTable } from '../../components/email/ContactListTable';
import { AddContactForm } from '../../components/email/AddContactForm';
import { CsvImportButton } from '../../components/email/CsvImportButton';
import { PermissionGuard } from '@/configurations/lib/permissions/engine';

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
          <PermissionGuard module="Email Marketing" submodule="Audience" action="Import">
            <CsvImportButton onImport={importContacts} />
          </PermissionGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <PermissionGuard module="Email Marketing" submodule="Audience" action="Create">
            <AddContactForm onAddContact={addContact} />
          </PermissionGuard>
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
