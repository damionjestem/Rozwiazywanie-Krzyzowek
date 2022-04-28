import React, { Component } from "react";
import "./mainform.css";
import { uploadFileToBlob } from "./blobUpload";
import { recognizeContent } from "./formRecognizer.js";

class FileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      value: "",
      file: null,
      answers: [], //answers.pair = {question: "", answer: ""}
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.outputDebug = [];
    this.fileUrls = [];
    this.sendGET = this.sendGET.bind(this);
  }

  async sendGET(event) {
    event.preventDefault();
  }

  handleFileChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.fileUrls = [];
    let tempArr = [];
    const file = this.fileInput.current.files[0];
    let arrResponse = [];
    console.log(`submit has happenned: ${file.name}`);

    try {
      //upload file and receive list of urls of uploaded files already
      arrResponse = await uploadFileToBlob(this.fileInput.current.files[0]);
      console.log(arrResponse.length);
      //get files urls list
      this.fileUrls = arrResponse;
      //get files names
      tempArr = arrResponse.map((el) => {
        el = el.split("/");
        return el[el.length - 1];
      });
    } catch (err) {
      console.error(err);
    }
    try {
      var id = tempArr.indexOf(file.name);
      //read content of crossord
      var ans = await recognizeContent(this.fileUrls[id]);
      console.log("ans", ans);
      this.setState({ answers: await ans });
      console.log("ansers in state", this.state.answers);
    } catch (err) {
      console.error("The sample encountered an error:", err);
    }
    // uploadFileToBlob(this.fileInput.current.files[0])
    //   .then((array) => {
    //     fileUrls = array;
    //     tempArr = array.map((el) => {
    //       el = el.split("/");
    //       return el[el.length - 1];
    //     });
    //   })
    //   .then(() => {
    //     const id = tempArr.indexOf(fileName);
    //     var ans = recognizeContent(fileUrls[id])
    //       .catch((err) => {
    //         console.error("The sample encountered an error:", err);
    //       })
    //       .then(() => {
    //         console.log("ans", ans);
    //         this.setState({
    //           answers: turnPromiseToArray(ans),
    //         });
    //         console.log("this state answers", this.state.answers);
    //       });
    //   });
  }

  render() {
    let pairs;

    if (this.state.answers.length > 0) {
      pairs = this.state.answers.map((response) => (
        <li>
          {response.pair.question}: {response.pair.answer}
        </li>
      ));
    } else {
      pairs = "Tutaj zostanie wypisana lista haseł.";
    }
    return (
      <div className="FileForm wrapper">
        <div className="inputs-col">
          <span>Input</span>
          <form onSubmit={this.handleSubmit}>
            <p>Załaduj obraz do przeanalizowania poniżej:</p>
            <div>
              <label>
                O tutaj:
                <input
                  type="file"
                  id="input-file"
                  onChange={this.handleFileChange}
                  ref={this.fileInput}
                />
              </label>
            </div>
            <input type="submit" value="Przeanalizuj" />
          </form>
          <form onSubmit={this.sendGET}></form>
          <button>GET</button>
        </div>
        <div className="arrow"></div>
        <div className="loaded-col">
          <span>Twoje zdjęcie</span>
          <img className="result-display" src={this.state.file} alt="" />
        </div>
        <div className="output-col">
          <span>Wynik</span>
          <ul>{pairs}</ul>
        </div>
      </div>
    );
  }
}

export default FileForm;
