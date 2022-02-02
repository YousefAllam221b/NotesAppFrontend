import React from 'react';


class LoginButton extends React.Component{

  username = React.createRef();
  password = React.createRef();

  handleLoginButton = (e) => {
    e.preventDefault();
    this.props.userLogin(this.username.current.value, this.password.current.value);
    e.currentTarget.reset();
  }

  render()
  {
    return (
          <form  onSubmit = {this.handleLoginButton}>
            <input
              type = 'text'
              ref = {this.username}
              placeholder = "Enter Username"
            />
            <input
              type = 'text'
              ref = {this.password}
              placeholder = "Enter Password"
            />
            <input
               id = 'add-note'
              type = 'submit'
              value = 'Login'
            />
          </form>
    );
  }
}

export default LoginButton;
