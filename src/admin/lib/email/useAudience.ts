import { useState, useCallback } from 'react';
import type { Contact, AudienceSelection } from '@/admin/lib/email/types';
import { initialContacts } from '@/admin/lib/email/audienceState';

export function getValidRecipients(audience: AudienceSelection | undefined, allContacts: Contact[]): Contact[] {
  if (!audience) return [];
  
  if (audience.type === 'all') {
    return allContacts.filter(c => c.isSubscribed);
  }
  
  if (audience.type === 'specific') {
    return allContacts.filter(c => c.isSubscribed && audience.contactIds?.includes(c.id));
  }
  
  return [];
}

export function useAudience() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  // Derive common sets for campaign compatibility
  const subscribedContacts = contacts.filter(c => c.isSubscribed);
  const getContactIds = (filter: 'all' | 'subscribed') => {
    if (filter === 'subscribed') return subscribedContacts.map(c => c.id);
    return contacts.map(c => c.id);
  };

  const addContact = useCallback((email: string, firstName?: string, lastName?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (contacts.some(c => c.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'Email already exists in audience' };
    }

    const newContact: Contact = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      firstName: firstName?.trim() || undefined,
      lastName: lastName?.trim() || undefined,
      isSubscribed: true,
      createdAt: new Date().toISOString()
    };

    setContacts(prev => [newContact, ...prev]);
    return { success: true };
  }, [contacts]);

  const toggleSubscription = useCallback((id: string) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, isSubscribed: !c.isSubscribed } : c
    ));
  }, []);

  const importContacts = useCallback((newContacts: Omit<Contact, 'id' | 'createdAt'>[]) => {
    let imported = 0;
    let duplicates = 0;
    let invalid = 0;
    
    const validNewContacts: Contact[] = [];
    // Capture current known emails (including ones we are adding in this batch)
    const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()));

    for (const c of newContacts) {
      if (!c.email) {
        invalid++;
        continue;
      }
      
      const normalizedEmail = c.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(normalizedEmail)) {
        invalid++;
        continue;
      }

      if (existingEmails.has(normalizedEmail)) {
        duplicates++;
        continue;
      }

      existingEmails.add(normalizedEmail);
      validNewContacts.push({
        ...c,
        email: normalizedEmail,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      });
      imported++;
    }

    if (validNewContacts.length > 0) {
      setContacts(prev => [...validNewContacts, ...prev]);
    }

    return { imported, duplicates, invalid };
  }, [contacts]);

  return {
    contacts,
    subscribedContacts,
    getContactIds,
    addContact,
    toggleSubscription,
    importContacts
  };
}
