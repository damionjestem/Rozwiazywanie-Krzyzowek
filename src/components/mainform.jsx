import React, { Component } from "react";
import "./mainform.css";

class FileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      file: null,
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleNameChange(event) {
    this.setState({ value: event.target.value });
  }

  handleFileChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
  }

  handleSubmit(event) {
    alert(`submit has happenned: ${this.fileInput.current.files[0].name}`);
    event.preventDefault();
  }

  render() {
    return (
      <div className="FileForm wrapper">
        <div className="inputs-col">
          <span>Input</span>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleNameChange}
                />
              </label>
            </div>
            <div>
              <label>
                File:
                <input
                  type="file"
                  id="input-file"
                  onChange={this.handleFileChange}
                  ref={this.fileInput}
                />
              </label>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="arrow"></div>
        <div className="loaded-col">
          <span>Data provided</span>
          <img className="result-display" src={this.state.file} alt="" />
        </div>
        <div className="output-col">
          <span>Output</span>
        </div>
      </div>
    );
  }
}

export default FileForm;
