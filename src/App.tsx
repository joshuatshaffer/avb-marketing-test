import React, { useState } from "react";
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
    <div>
      <div>
        Contacts{" "}
        <button onClick={() => setState({ state: "adding" })}>+</button>
        <ContactList
          selectContact={contact => setState({ state: "editing", contact })}
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
