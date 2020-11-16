import React from "react";
import "./App.css";
import { ContactList } from "./ContactList";

function App() {
  return (
    <ContactList
      selectContact={contactId => alert(`You selected contact ${contactId}.`)}
    />
  );
}

export default App;
