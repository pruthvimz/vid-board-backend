import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import SnackbarContent from "@material-ui/core/SnackbarContent";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";

const JpSignUpIn = ({
  onSubmit,
  onChange,
  errors,
  message,
  successMessage,
  user,
  handleAction,
  action
}) => (
  <div>
    <form action="/" onSubmit={onSubmit} id="jpProfileForm">
      {message && message != "" ? (
        <SnackbarContent message={message} />
      ) : null}

      {successMessage && successMessage != "" ? (
        <SnackbarContent message={successMessage} />
      ) : null}

      <br />
      <TextField
        name="email"
        label="Email"
        value={user.email}
        placeholder="abc@xyz.com"
        onChange={onChange}
        margin="normal"
      />
      <FormHelperText id="email-error-text">{errors.email}</FormHelperText>
      <br />
      <TextField
        type="password"
        name="password"
        label="Password"
        value={user.password}
        onChange={onChange}
        margin="normal"
      />
      <FormHelperText id="password-error-text">
        {errors.password}
      </FormHelperText>
      <br />
      {action == "SignUp" ? (
        <div>
          <TextField
            type="password"
            name="confirmPwd"
            label="Confirm Password"
            value={user.confirmPwd}
            onChange={onChange}
            margin="normal"
          />
          <FormHelperText id="confirmPwd-error-text">
            {errors.confirmPwd}
          </FormHelperText>
        </div>
      ) : null}
      <br />

      <input type="submit" value={action == "SignUp" ? "Sign Up" : "Sign In"} />

      <br />
      <br />
      <a href="javascript:void(0)" onClick={handleAction}>        
        Want to {action == "SignUp" ? "Sign In" : "Sign Up"}
      </a>
    </form>
  </div>
);
            
export default JpSignUpIn;
