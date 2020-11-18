import React from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Control,
  UseFormMethods
} from "react-hook-form";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import {
  ContactResponseDto,
  ContactDto,
  addContact,
  editContact,
  deleteContact
} from "./avb-contacts-api";
import "./ContactForm.css";

interface FieldValues {
  firstName: string;
  lastName: string;
  emails?: { id?: any; value: string }[];
}

function contactToFieldValues(contact: ContactResponseDto): FieldValues {
  // Emails must be converted to an array of records with unique ids because
  // react-hook-form does not support flat arrays. react-hook-form generates
  // the ids if we do not provide them.
  const emails = contact.emails.map(value => ({ value }));

  return {
    ...contact,
    emails
  };
}

function fieldValuesToContact(values: FieldValues): ContactDto {
  const emails = values.emails?.map(({ value }) => value) ?? [];

  return {
    ...values,
    emails
  };
}

function EmailInputs({
  register,
  control
}: {
  register: UseFormMethods<FieldValues>["register"];
  control: Control<FieldValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails"
  });

  return (
    <div className="emails-section">
      Email
      <ul className="email-list">
        {fields.map((item, index) => (
          <li key={item.id}>
            <input
              className="text-input"
              name={`emails[${index}].value`}
              type="email"
              required
              ref={register({ required: true })}
              defaultValue={item.value}
            />

            <button
              className="email-delete-button"
              type="button"
              onClick={() => remove(index)}
            >
              <AiFillMinusCircle size="30px" />
            </button>
          </li>
        ))}
      </ul>
      <button
        className="email-add-button"
        type="button"
        onClick={() => append({ value: "" })}
      >
        <AiFillPlusCircle size="30px" /> add email
      </button>
    </div>
  );
}

export interface ContactFormProps {
  /** The contact to edit. If this is not defined the form creates a new contact. */
  contactToEdit?: ContactResponseDto;
  /** A callback signaling that this form is no longer needed and should be closed. */
  onFormDone?: () => void;
}

/** This component serves to both create, view, and edit contacts. */
export function ContactForm({ contactToEdit, onFormDone }: ContactFormProps) {
  const { register, handleSubmit, control } = useForm<FieldValues>({
    defaultValues: contactToEdit
      ? contactToFieldValues(contactToEdit)
      : { firstName: "", lastName: "", emails: [] }
  });

  const onSubmit: SubmitHandler<FieldValues> = data => {
    if (contactToEdit) {
      editContact({ ...fieldValuesToContact(data), id: contactToEdit.id });
    } else {
      addContact(fieldValuesToContact(data));
    }
    onFormDone?.();
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="names-section">
        <label>
          First Name
          <input
            className="text-input"
            name="firstName"
            required
            ref={register({ required: true })}
          />
        </label>

        <label>
          Last Name
          <input
            className="text-input"
            name="lastName"
            required
            ref={register({ required: true })}
          />
        </label>
      </div>

      <EmailInputs register={register} control={control} />

      <div className="buttons-section">
        {contactToEdit ? (
          <button
            className="delete-button"
            onClick={() => {
              deleteContact(contactToEdit);
              onFormDone?.();
            }}
          >
            Delete
          </button>
        ) : null}
        <button className="cancel-button" onClick={() => onFormDone?.()}>
          Cancel
        </button>
        <button className="submit-button" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}
