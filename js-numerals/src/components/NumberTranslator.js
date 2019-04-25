import React, {Component} from 'react';
import {Button, Form, Container, Col, Row} from 'react-bootstrap';
import {getNumberInEnglish} from '../functions/getNumberInEnglish.js'

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

          <Container>
            <Row>
              <Col></Col>
              <Col md="7">
                <div className="text-center">
                  <Form onSubmit={this.handleSubmit} >
                    <Form.Label column="true">Enter an integer number you wish to translate to English!</Form.Label>
                    <br></br>
                    <Form.Control type="number" placeholder="your number here" onChange={this.handleChange}/>
                    <br></br>
                    <Button variant="primary" type="submit">Translate!</Button>
                  </Form>
                  <br></br>
                  <p>Your number in English:</p>
                  <p><b>{this.state.numberInEnglish}</b></p>
                </div>
              </Col>
              <Col></Col>
            </Row>
          </Container>

      </div>
    );
  }  
}

export default NumberTranslator;
