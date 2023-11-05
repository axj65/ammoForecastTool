import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import Login from './login';
import { BrowserRouter as Router } from 'react-router-dom';


test('render Login component and submit form', async () => {
  render(
    <Router>
      <Login />
    </Router>
  );

  // Find the form input elements by their labels
  const emailElement = screen.getByLabelText('Email');
  expect(emailElement).toBeInTheDocument();
  const passwordElement = screen.getByLabelText('Password');
  expect(passwordElement).toBeInTheDocument();

  // Find the "Login" button by its class name
  const submitButton = screen.getByText('Login', { selector: 'input[type="submit"]' });


  // Fill in the input fields
  fireEvent.change(emailElement, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordElement, { target: { value: 'password123' } });

  // Submit the form
  act(() => {
    fireEvent.click(submitButton);
  });

});

describe("Input fields", () => {
  test("Input field should accept text", () => {
  const { getByLabelText, getByText } = render(<Router><Login/></Router>);
  const emailInputNode = getByLabelText("Email");
  
  expect(emailInputNode.value).toMatch("");
  
  fireEvent.change(emailInputNode, { target: {value: 'ziyiwang919@gmail.com' }});
  
  expect(emailInputNode.value).toMatch('ziyiwang919@gmail.com');
  
  const passwordInputNode = getByLabelText("Password");
  
  expect(passwordInputNode.value).toMatch("");
  
  fireEvent.change(passwordInputNode, { target: {value: 'pass123' }});
  
  expect(passwordInputNode.value).toMatch('pass123');
  });

});