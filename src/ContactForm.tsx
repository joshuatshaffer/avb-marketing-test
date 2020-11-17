import React from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Control,
  UseFormMethods
} from "react-hook-form";
import {
  ContactResponseDto,
  ContactDto,
  addContact,
  editContact,
  deleteContact
} from "./avb-contacts-api";

interface FieldValues {
  firstName: string;
  lastName: string;
  emails: { id?: any; value: string }[];
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
  const emails = values.emails.map(({ value }) => value);

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
    <>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <input
              name={`emails[${index}].value`}
              type="email"
              required
              ref={register({ required: true })}
              defaultValue={item.value}
            />

            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => append({ value: "" })}>
        +
      </button>
    </>
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        First Name
        <input name="firstName" required ref={register({ required: true })} />
      </label>

      <label>
        Last Name
        <input name="lastName" required ref={register({ required: true })} />
      </label>

      <EmailInputs register={register} control={control} />

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
