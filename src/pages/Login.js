import React, { useEffect } from 'react';
import { Flex, Card, Heading, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '../hooks/useAxios';
import { authService } from '../security/authService';


function Login(props) {

  const [onLogin, { data, loading }] = useMutation('auth/signin', 'post');
  const navigate = useNavigate();

  const handleSubmit = (formValues) => {
    onLogin(formValues)
  }

  const form = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (data) {
      authService.saveToken(data.token);
      navigate('/inventory');
    }
  }, [data])

  return (
    <Flex
      align='center'
      justify='center'
      width='100wh'
      background='#F4F6FB'
      height='100vh'
    >
      <Card
        boxShadow='0px 10px 20px #0000001F'
        border='1px solid #E1E7EF'
        width='420px'
        p={6}
      >
        <Heading as='h4' size='md' mb={4}>
          Duck Trucks
        </Heading>

        <form onSubmit={form.handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type='email'
              onChange={form.handleChange}
              id='email'
              name='email'
              value={form.values.email} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type='password'
              onChange={form.handleChange}
              id='password'
              name='password'
              value={form.values.password} />
          </FormControl>

          <Button
            mt={4}
            colorScheme='teal'
            isLoading={loading}
            type='submit'
          >
            Submit
          </Button>

        </form>


      </Card>
    </Flex>
  );
}

export default Login;