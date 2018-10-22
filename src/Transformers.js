import { isObject, isArray, toPlainObject, toArray } from 'lodash';

export const object = (data = {}) => {
  if (isObject(data)) return data;
  let _data = false;
  if (typeof data === 'string') {
    try {
      _data = JSON.parse(data.trim());
    } catch (e) {
      console.log(e);
    }
  }
  if (_data) return _data;
  return toPlainObject(data);
};
export const array = (data = []) => {
  if (isArray) return data;
  return toArray(data);
};

export const cumulativeArray = check => (data = [], oldData = []) => {
  if (!data) return oldData;
  if (!check) return oldData.concat(isArray(data) ? data : toArray(data));
  const newData = [...oldData];
  data.forEach((d) => {
    let doesExist = false;
    oldData.forEach((o, i) => {
      if (d[check] === o[check]) {
        newData[i] = d;
        doesExist = true;
      }
    });
    if (!doesExist) newData.push(d);
  });
  return newData;
};

export default {
  object,
  array,
  cumulativeArray,
};
