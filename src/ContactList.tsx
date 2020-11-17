import React from "react";
import { useContactsPaginated, ContactResponseDto } from "./avb-contacts-api";
import "./ContactList.css";

export interface ContactListProps {
  selectContact: (contact: ContactResponseDto) => void;
  selectedContact?: ContactResponseDto;
}

export function ContactList({
  selectContact,
  selectedContact
}: ContactListProps) {
  const { data, error } = useContactsPaginated();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <ul className="contact-list">
      {data.contacts.map(contact => (
        <li key={contact.id}>
          <button
            className={
              "unbutton " +
              (selectedContact?.id === contact.id ? "selected-contact" : "")
            }
            onClick={() => selectContact(contact)}
          >
            {contact.firstName} {contact.lastName}
          </button>
        </li>
      ))}
    </ul>
  );
}
