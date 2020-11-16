import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ContactList } from "./ContactList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ContactList
        selectContact={contactId => alert(`You selected contact ${contactId}.`)}
      />
    </div>
  );
}

export default App;
