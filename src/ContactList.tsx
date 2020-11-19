import React from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
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
  const { contacts, error, hasNextPage, onLoadMore } = useContactsPaginated();

  const infiniteRef = useInfiniteScroll<HTMLUListElement>({
    loading: !contacts,
    hasNextPage,
    onLoadMore,
    scrollContainer: "parent"
  });

  if (error) return <div>failed to load</div>;
  if (!contacts) return <div>loading...</div>;
  return (
    <ul className="contact-list" ref={infiniteRef}>
      {contacts.map(contact => (
        <li key={contact.id}>
          <button
            className={
              "select-contact-button " +
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
