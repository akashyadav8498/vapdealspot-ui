import { useState } from 'react';
import { Button } from '@/admin/components/ui/button';
import { Input } from '@/admin/components/ui/input';

type AddContactFormProps = {
  onAddContact: (email: string, firstName?: string, lastName?: string) => { success: boolean; error?: string };
};

export function AddContactForm({ onAddContact }: AddContactFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const names = name.trim().split(' ');
    const firstName = names[0] || undefined;
    const lastName = names.slice(1).join(' ') || undefined;

    const result = onAddContact(email, firstName, lastName);
    
    if (result.success) {
      setEmail('');
      setName('');
    } else {
      setError(result.error || 'Failed to add contact');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">Add Contact</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
          <Input 
            value={email} 
            onChange={e => {
              setEmail(e.target.value);
              setError(null); // Clear error on typing
            }} 
            placeholder="hello@example.com"
            type="email"
            required
            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Name (Optional)</label>
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="John Doe"
          />
        </div>
        
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}

        <Button type="submit" className="w-full">Add Contact</Button>
      </form>
    </div>
  );
}
