import React, { Component } from "react";
import "./mainform.css";
import { QuestionSet } from "./QuestionSet";
import { uploadFileToBlob, getBlobsInContainer } from "./blobUpload";
import { analyzeImage } from "./formRecognizer.js";
//import readFile from "../computervision.js";

class FileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      value: "",
      file: null,
    };
    this.answers = [];
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.outputDebug = [];
  }

  handleNameChange(event) {
    this.setState({ value: event.target.value });
    var q = new QuestionSet(this.state.value);
    q.setQA();
    this.answers = q.qaArray;
  }

  handleFileChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
  }

  handleSubmit(event) {
    const fileUrl = uploadFileToBlob(this.fileInput.current.files[0]);
    this.outputDebug.push({
      blobs: fileUrl, //getBlobsInContainer(fileUrl),
      message: `submit has happenned: ${this.fileInput.current.files[0].name}`,
    });

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
          <ul>
            {this.answers.map((value, index) => {
              return (
                <li>
                  {value.question}: {value.answer}
                </li>
              );
            })}
          </ul>
          <ul>
            {this.outputDebug.map((value, index) => {
              return (
                <li>
                  {index}: {value.blobs[value.blobs.length - 1]},{value.message}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default FileForm;
