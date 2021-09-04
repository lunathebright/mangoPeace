import { BASE_URL } from '../config';

function fetchData(endPoint, options = {}, { onSuccess, onReject } = {}) {
  const opts = {
    method: 'GET',
    ...options,
  };
  return fetch(`${BASE_URL}/${endPoint}`, opts)
    .then(res => res.json())
    .then(res => onSuccess && onSuccess(res))
    .catch(err => onReject && onReject(err));
}

export default fetchData;
