import React from 'react';


class LoginButton extends React.Component{

  username = React.createRef();
  password = React.createRef();

  handleLoginButton = (e) => {
    e.preventDefault();
    this.props.userLogin(this.username.current.value, this.password.current.value);
  }

  handleRegisterButton = (e) => {
    e.preventDefault();
    this.props.userRegister(this.username.current.value, this.password.current.value);
  }

  render()
  {
    return (
          <form className='d-flex'>
            <div className='d-flex flex-column'>
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
            </div>
            <div className='d-flex flex-column'>
              <input
                id = 'add-note'
                type = 'button'
                value = 'Login'
                onClick = {this.handleLoginButton}
              />
              <input
                id = 'add-note'
                type = 'button'
                value = 'Register'
                onClick = {this.handleRegisterButton}
              />
            </div>
          </form>
    );
  }
}

export default LoginButton;
