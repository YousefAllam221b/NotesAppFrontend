import React, { Component } from "react";

class Sharedtextarea extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  render() {
    return (
      <div>
        <label>Enter value : </label>
        <input type="textare" 
          name="textValue"
          row = '10'
          
          onChange={this.props.handleChange}
          value = {this.props.value}
        />
      </div>
    );
  }
}

export default Sharedtextarea;