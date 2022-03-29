import React, { Component } from "react";
import "./App.css";
import FileForm from "./components/mainform";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert(`submit has happenned: ${this.fileInput.current.files[0].name}`);
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Rozwiąż każdą krzyżówkę...</h1>
        </header>
        <FileForm />
      </div>
    );
  }
}

export default App;
