class Btn extends React.Component {
  render() {
    if (this.props.value == '=') {
      return React.createElement(
        'td',
        null,
        React.createElement('input', { type: 'button', value: this.props.value, onClick: () => this.props.onClick(), name: 'equals' })
      );
    } else if (this.props.value == '/' || this.props.value == '*' || this.props.value == '-' || this.props.value == '+') {
      return React.createElement(
        'td',
        null,
        React.createElement('input', { type: 'button', value: this.props.value, onClick: () => this.props.onClick(this.props.value), name: 'operator' })
      );
    } else {
      return React.createElement(
        'td',
        null,
        React.createElement('input', { type: 'button', value: this.props.value, onClick: () => this.props.onClick(this.props.value) })
      );
    }
  }
}

class Display extends React.Component {
  render() {
    return React.createElement('input', { type: 'text', value: this.props.value });
  }
}

class Calc extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: '0',
      operation: null,
      finalans: false
    };
  }

  setDisplay(res) {
    var tres = this.state.result;
    if (tres == '0' || tres == "Error" || this.state.finalans) {
      tres = {};
      if (this.state.finalans) {
        Object.assign(tres, this.state, { result: res, finalans: false, operation: null });
      } else {
        Object.assign(tres, this.state, { result: res });
      }
      this.setState(tres);
    } else {
      var current_result = this.state.result;
      tres = {};
      Object.assign(tres, this.state, { result: current_result + res });
      this.setState(tres);
    }
  }

  setOperator(op) {
    var newstate = {};
    Object.assign(newstate, this.state);
    if (newstate.operation) {
      return;
    } else {
      newstate.operation = op;
      newstate.result = newstate.result + op;
      newstate.finalans = false;
      this.setState(newstate);
    }
  }

  setAnswer(ans) {
    var newstate = {};
    Object.assign(newstate, this.state, { result: ans, finalans: true });
    this.setState(newstate);
  }

  resetState(keepdisplay) {
    if (keepdisplay) {
      var newstate = {};
      Object.assign(newstate, this.state, { operation: null });
      this.setState(newstate);
    } else {
      var newstate = {};
      Object.assign(newstate, this.state, { result: '0', operation: null });
      this.setState(newstate);
    }
  }
  execute() {
    var numstr = this.state.result;
    var oper = this.state.operation;

    if (oper) {
      numstr = numstr.split(oper);

      var number1 = numstr[0];
      var number2 = numstr[1];

      fetch('/calc/calculate/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "num1": number1,
          "num2": number2,
          "op": oper
        })
      }).then(response => response.json()).then(responsejson => {
        this.setAnswer(responsejson.answer);
        this.resetState(true);
      }).catch(error => {
        console.log(error);
        this.setAnswer('Error');
      });
    }
  }

  render() {
    return React.createElement(
      'table',
      null,
      React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            { colSpan: '7' },
            React.createElement(Display, { value: this.state.result })
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(Btn, { value: '7', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '8', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '9', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '/', onClick: p => this.setOperator(p) })
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(Btn, { value: '4', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '5', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '6', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '*', onClick: p => this.setOperator(p) })
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(Btn, { value: '1', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '2', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '3', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '-', onClick: p => this.setOperator(p) })
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(Btn, { value: '0', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '.', onClick: p => this.setDisplay(p) }),
          React.createElement(Btn, { value: '=', onClick: () => this.execute() }),
          React.createElement(Btn, { value: '+', onClick: p => this.setOperator(p) })
        )
      )
    );
  }
}
ReactDOM.render(React.createElement(Calc, null), document.getElementById('root'));
