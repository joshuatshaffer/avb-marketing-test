import React from "react";
import { useContactsPaginated } from "./avb-contacts-api";

export interface ContactListProps {
  selectContact: (contactId: number) => void;
}

export function ContactList({ selectContact }: ContactListProps) {
  const { data, error } = useContactsPaginated();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <ul>
      {data.contacts.map(contact => (
        <li>
          <button onClick={() => selectContact(contact.id)}>
            {contact.firstName} {contact.lastName}
          </button>
        </li>
      ))}
    </ul>
  );
}
