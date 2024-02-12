import { useToast } from '@chakra-ui/react';
import get from 'lodash/get';

const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  const errors = get(error, 'response.data.errors');
  if (typeof errors === 'object') {
    const key = get(Object.keys(errors), '[0]');
    const firstError = get(errors, `${key}[0]`);
    if (firstError) {
      return firstError;
    }
  }

  return get(error, 'response.data') || get(error, 'message');
};

export const useMessages = () => {
  const errorToast = useToast();

  const showError = (title, description) => {
    errorToast({
      title,
      description: getErrorMessage(description),
      status: 'error',
      position: 'top',
      variant: 'top-accent',
      isClosable: true,
    });
  };

  const showSuccess = (title, description) => {
    errorToast({
      title,
      description,
      status: 'success',
      position: 'top',
      variant: 'top-accent',
      isClosable: true,
    });
  };

  return {
    showError,
    showSuccess,
  };
};
