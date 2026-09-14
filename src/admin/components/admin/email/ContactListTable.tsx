import type { Contact } from '@/admin/lib/email/types';
import { Button } from '@/admin/components/ui/button';
import { Check, X } from 'lucide-react';

type ContactListTableProps = {
  contacts: Contact[];
  onToggleSubscription: (id: string) => void;
};

export function ContactListTable({ contacts, onToggleSubscription }: ContactListTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
        No contacts found in audience.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Mobile View (Cards) */}
      <div className="block md:hidden divide-y divide-border/50">
        {contacts.map((contact) => {
          const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ');
          return (
            <div key={contact.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{contact.email}</p>
                  {fullName && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{fullName}</p>
                  )}
                </div>
                <div>
                  {contact.isSubscribed ? (
                    <span className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full whitespace-nowrap">
                      <Check className="w-3 h-3 mr-1" /> Subscribed
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full whitespace-nowrap">
                      <X className="w-3 h-3 mr-1" /> Unsubscribed
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  Added: {new Date(contact.createdAt).toLocaleDateString()}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onToggleSubscription(contact.id)}
                  className="h-8 text-xs"
                >
                  {contact.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground whitespace-nowrap">Email</th>
              <th className="px-4 py-3 font-medium text-foreground whitespace-nowrap">Name</th>
              <th className="px-4 py-3 font-medium text-foreground whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium text-foreground whitespace-nowrap">Added</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate" title={contact.email}>
                  {contact.email}
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate" title={[contact.firstName, contact.lastName].filter(Boolean).join(' ') || '-'}>
                  {[contact.firstName, contact.lastName].filter(Boolean).join(' ') || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {contact.isSubscribed ? (
                    <span className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 mr-1" /> Subscribed
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                      <X className="w-3 h-3 mr-1" /> Unsubscribed
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleSubscription(contact.id)}
                  >
                    {contact.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
