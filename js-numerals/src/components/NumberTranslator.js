import React, {Component} from 'react';
import {Button, Form} from 'react-bootstrap';
import getNumberInEnglish from '../functions/getNumberInEnglish.js'

class NumberTranslator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberInArabicNumbers: '',
      numberInEnglish: ''
    }
  }

  handleChange = event => {
    this.setState({numberInArabicNumbers: event.target.value});
  }

  handleSubmit = event => {   
    const numberInEnglish = getNumberInEnglish(this.state.numberInArabicNumbers);
    this.setState({numberInEnglish: numberInEnglish});
    event.preventDefault();
  };


  render() {
    return (
      <div>
        <div className="col-lg-6">
          <Form onSubmit={this.handleSubmit}>
              <Form.Label>Enter an integer!</Form.Label>
              <Form.Control type="number" placeholder="Only integers please" onChange={this.handleChange}/>
            
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
          {this.state.numberInEnglish}
        </div>
      </div>
    );
  }  
}

export default NumberTranslator;
