import React, { Component } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: "",
      email: "",
      username: "",
      profile_pic_patch: "",
      validate: false,
      dbuser: [],
      user: {
        email: "",
        password: ""
      }
    };
  }

  render() {
    const { user } = this.state;
    if (this.state.validate) {
      return (
        <Redirect
          to={{
            pathname: "/main",
            state: {
              email: this.state.email,
              username: this.state.username,
              profile_pic_patch: this.state.profile_pic_patch
            }
          }}
        />
      );
    }

    return (
      <div>
        <div className="logo rounded mx-auto d-block">
          <img
            width="200"
            height="200"
            src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/San_Jose_State_Spartans_logo.svg/378px-San_Jose_State_Spartans_logo.svg.png"
            alt="SJSU SAMMY"
          />
          <p className="h3 mb-3 text-center font-weight-bold">SJSU Bookhub</p>
          <h1 className="text-center h4 mb-3 font-weight-normal">Sign In</h1>
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            onChange={e =>
              this.setState({ user: { ...user, email: e.target.value } })
            }
            placeholder="Email address"
            required
            autoFocus
          ></input>
          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            onChange={e =>
              this.setState({ user: { ...user, password: e.target.value } })
            }
            placeholder="Password"
            required
          ></input>
          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={this.logIn}
            type="submit"
          >
            Login in
          </button>
          <div className="mb-3">
            Need an account? &nbsp;
            <Link to="/signup">Sign up</Link>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; SJSU 2019</p>
        </div>
      </div>
    );
  }

  logIn = async _ => {
    const { user, dbuser } = this.state;
    await fetch(`http://localhost:4000/login?email=${user.email}`).then(res =>
      res.json().then(res =>
        this.setState(
          {
            dbuser: res.data
          },
          () =>
            this.state.dbuser.map(p =>
              this.setState({
                email: p.email,
                pass: p.password,
                username: p.username,
                profile_pic_patch: p.profile_pic_patch
              })
            )
        )
      )
    );

    if (this.state.pass === this.state.user.password) {
      this.setState({ validate: true });
    }
  };
}

export default Login;
