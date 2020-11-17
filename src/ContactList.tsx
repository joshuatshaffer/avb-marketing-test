import React from "react";
import { useContactsPaginated, ContactResponseDto } from "./avb-contacts-api";

export interface ContactListProps {
  selectContact: (contact: ContactResponseDto) => void;
}

export function ContactList({ selectContact }: ContactListProps) {
  const { data, error } = useContactsPaginated();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <ul>
      {data.contacts.map(contact => (
        <li key={contact.id}>
          <button onClick={() => selectContact(contact)}>
            {contact.firstName} {contact.lastName}
          </button>
        </li>
      ))}
    </ul>
  );
}
