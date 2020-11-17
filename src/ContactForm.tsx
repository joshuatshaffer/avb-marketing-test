import React from "react";
import { ContactResponseDto } from "./avb-contacts-api";

export interface ContactFormProps {
  /** The contact to edit. If this is not defined the form creates a new contact. */
  contactToEdit?: ContactResponseDto;
  /** A callback signaling that this form is no longer needed and should be closed. */
  onFormDone?: () => void;
}

/** This component serves to both create, view, and edit contacts. */
export function ContactForm({ contactToEdit, onFormDone }: ContactFormProps) {
  return (
    <form>
      <div>{JSON.stringify({ contactToEdit })}</div>

      <button onClick={() => onFormDone?.()}>Cancel</button>
    </form>
  );
}
