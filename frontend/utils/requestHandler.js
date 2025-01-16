import { toast } from "react-toastify";
import Strings from "../constants/Strings";

const getToken = () => {
  try {
    let tok = localStorage.getItem('token');
    if (tok) {
      return tok; // Return token directly if found
    }
  } catch (e) {
    console.log('Error retrieving token:', e);
  }
  return null; // Return null if token not found or error
};

const createHeaders = (bearer) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (bearer) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
  }

  return headers;
};

const createHeadersFormData = (bearer) => {
  const headers = {

  };

  if (bearer) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
  }

  return headers;
};

const fetchData = async (url, options) => {
  try {
    const response = await fetch(process.env.baseUrl + url, options);
    const result = await response.json();
    const statusCode = response.status;

    console.log('Success:', result);

    return { result, statusCode };
  } catch (error) {
    //toast.error(Strings.internalServerError)
    console.log('Fetch error:', error);
    return { result: null, statusCode: 500 }; // Return a standard error response
  }
};

const get = async (url, bearer = false) => {
  const options = {
    method: 'GET',
    headers: createHeaders(bearer),
  };
  
  return fetchData(url, options);
};

const post = async (url, form, bearer = false) => {
  const options = {
    method: 'POST',
    headers: createHeaders(bearer),
    body: JSON.stringify(form),
  };

  const { result, statusCode } = await fetchData(url, options);  
  return { result, statusCode };
};

const postForm = async (url, form, bearer = false) => {
  const options = {
    method: 'POST',
    headers: createHeadersFormData(bearer),
    body: form,
  };

  const { result, statusCode } = await fetchData(url, options);
  
  return { result, statusCode };
};


const patch = async (url, form, bearer = false) => {
  const options = {
    method: 'PATCH',
    headers: createHeaders(bearer),
    body: JSON.stringify(form),
  };

  const { result, statusCode } = await fetchData(url, options);
  
  return { result, statusCode };
};

const put = async (url, form, bearer = false) => {
  const options = {
    method: 'PUT',
    headers: createHeaders(bearer),
    body: form,
  };

  const { result, statusCode } = await fetchData(url, options);
  
  return { result, statusCode };
};

const putForm = async (url, form, bearer = false) => {
  const options = {
    method: 'PUT',
    headers: createHeadersFormData(bearer),
    body: form,
  };

  const { result, statusCode } = await fetchData(url, options);
  
  return { result, statusCode };
};

const deleteReq = async (url, bearer = false) => {
  const options = {
    method: 'DELETE',
    headers: createHeaders(bearer)
  };

  const { result, statusCode } = await fetchData(url, options);
  return { result, statusCode };
};

export default { get, post, postForm, patch, put, putForm, deleteReq, getToken };