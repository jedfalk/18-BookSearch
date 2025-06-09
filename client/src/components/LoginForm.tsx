// src/components/LoginForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/graphql';
import Auth from '../utils/auth';

interface LoginFormProps {
  handleModalClose: () => void;
}

interface LoginData {
  login: {
    token: string;
    user: {
      _id: string;
      username: string;
      email: string;
    };
  };
}

interface LoginVars {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleModalClose }) => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [loginUser, { loading }] = useMutation<LoginData, LoginVars>(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { email: userFormData.email, password: userFormData.password },
      });

      if (data?.login.token) {
        Auth.login(data.login.token);
        handleModalClose();
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({ email: '', password: '' });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      <Alert
        dismissible
        onClose={() => setShowAlert(false)}
        show={showAlert}
        variant='danger'
      >
        Something went wrong with your login credentials!
      </Alert>

      <Form.Group className='mb-3'>
        <Form.Label htmlFor='email'>Email</Form.Label>
        <Form.Control
          type='email'
          placeholder='Your email'
          name='email'
          onChange={handleInputChange}
          value={userFormData.email}
          required
        />
        <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label htmlFor='password'>Password</Form.Label>
        <Form.Control
          type='password'
          placeholder='Your password'
          name='password'
          onChange={handleInputChange}
          value={userFormData.password}
          required
        />
        <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
      </Form.Group>

      <Button
        disabled={!userFormData.email || !userFormData.password || loading}
        type='submit'
        variant='success'
      >
        {loading ? 'Loading...' : 'Submit'}
      </Button>
    </Form>
  );
};

export default LoginForm;
