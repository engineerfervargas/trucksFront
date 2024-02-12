import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import isArray from 'lodash/isArray';
import has from 'lodash/has';
import get from 'lodash/get';

import { authService } from '../security/authService';
import { useMessages } from './useMessages';

const getConfig = () => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `${authService.getToken()}`,
  },
});

const getResponseData = (response) => {
  let dataValue = response.data;
  if (has(dataValue, 'records')) {
    return get(dataValue, 'records');
  }

  if (dataValue && Object.keys(dataValue).length === 1) {
    const key = Object.keys(dataValue)[0];
    if (isArray(dataValue[key])) {
      dataValue = dataValue[key];
    }
  }
  return dataValue;
};

const getParameters = (params) => {
  const urlParams = new URLSearchParams();
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value && Array.isArray(value) && value.length) {
      value.forEach((innerValue) => {
        urlParams.append(key, innerValue);
      });
    } else {
      urlParams.append(key, value);
    }
  });

  return urlParams.toString();
};

export const useMutation = (url = '', method = 'post') => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showError } = useMessages();

  const mutation = (body, mutationUrl, callBack) => {
    const config = getConfig();
    const baseUrl = 'http://localhost:8091';

    setLoading(true);
    axios[method](`${baseUrl}/${mutationUrl || url}`, body, config)
      .then((response) => {
        setData(response.data || {});
        if (typeof callBack === 'function') {
          callBack(response.data);
        }
      })
      .catch((e) => {
        showError('Error', e);
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [mutation, { data, error, loading }];
};

export const useQuery = (url, params = {}) => {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showError } = useMessages();
  const paramsRef = useRef(params);

  const fetchQuery = () => {
    const config = getConfig();
    const baseUrl = 'http://localhost:8091';

    if (url) {
      let queryUrl = `${baseUrl}/${url}`;
      const urlParams = getParameters(paramsRef.current);
      if (urlParams) {
        queryUrl = `${queryUrl}?${urlParams}`;
      }

      setLoading(true);
      axios
        .get(queryUrl, config)
        .then((response) => {
          const dataValue = getResponseData(response);
          setData(dataValue);

          if (has(response, 'data.count')) {
            setCount(response.data.count);
          } else {
            setCount(dataValue.length);
          }
        })
        .catch((e) => {
          showError('Error', e);
          setError(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleRefetch = () => {
    fetchQuery();
  };

  useEffect(() => {
    fetchQuery();
  }, []);

  return {
    data,
    error,
    loading,
    onRefetch: handleRefetch,
    count,
  };
};
