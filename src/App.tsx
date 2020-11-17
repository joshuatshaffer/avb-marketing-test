import React, { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import "./App.css";
import { ContactList } from "./ContactList";
import { ContactForm } from "./ContactForm";
import { ContactResponseDto } from "./avb-contacts-api";

/** The high level state of the application. */
type AppState =
  | { state: "idle" | "adding" }
  | { state: "editing"; contact: ContactResponseDto };

function App() {
  const [state, setState] = useState<AppState>({ state: "idle" });

  const onFormDone = () => setState({ state: "idle" });

  return (
    <div className="app">
      <div className="contact-list-container">
        <div className="contact-list-header">
          <h1>Contacts</h1>
          <button
            className="add-button"
            onClick={() => setState({ state: "adding" })}
          >
            <IoIosAddCircle size="43px" />
          </button>
        </div>
        <ContactList
          selectContact={contact => setState({ state: "editing", contact })}
          selectedContact={
            state.state === "editing" ? state.contact : undefined
          }
        />
      </div>
      <div>
        {state.state === "adding" ? (
          <ContactForm onFormDone={onFormDone} />
        ) : state.state === "editing" ? (
          <ContactForm
            key={state.contact.id}
            onFormDone={onFormDone}
            contactToEdit={state.contact}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
