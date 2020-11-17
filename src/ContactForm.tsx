import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  ContactResponseDto,
  ContactDto,
  addContact,
  editContact,
  deleteContact
} from "./avb-contacts-api";

export interface ContactFormProps {
  /** The contact to edit. If this is not defined the form creates a new contact. */
  contactToEdit?: ContactResponseDto;
  /** A callback signaling that this form is no longer needed and should be closed. */
  onFormDone?: () => void;
}

/** This component serves to both create, view, and edit contacts. */
export function ContactForm({ contactToEdit, onFormDone }: ContactFormProps) {
  const { register, handleSubmit } = useForm<ContactDto>({
    defaultValues: contactToEdit ?? { firstName: "", lastName: "", emails: [] }
  });

  const onSubmit: SubmitHandler<ContactDto> = data => {
    if (contactToEdit) {
      editContact({ ...data, id: contactToEdit.id });
    } else {
      addContact(data);
    }
    onFormDone?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        First Name
        <input name="firstName" ref={register({ required: true })} />
      </label>

      <label>
        Last Name
        <input name="lastName" ref={register({ required: true })} />
      </label>

      {contactToEdit ? (
        <button
          onClick={() => {
            deleteContact(contactToEdit);
            onFormDone?.();
          }}
        >
          Delete
        </button>
      ) : null}
      <button onClick={() => onFormDone?.()}>Cancel</button>
      <input type="submit" value="Submit" />
    </form>
  );
}
