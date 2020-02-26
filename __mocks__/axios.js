const _ = require('lodash');

let labelsFromRepo = [];
let labelsInUse = [];

let error = '';
let inUseError = '';
let calls = [];

const isAuthorized = headers => {
  if (error !== '') {
    return true;
  }
  const bearer = RegExp('^Bearer [a-zA-Z]*[tT]{1}oken[a-zA-Z]*$');
  if (
    !headers ||
    !headers.Authorization ||
    !bearer.test(headers.Authorization)
  ) {
    error = new Error('Not Authorized');
    error.status = 401;
    return false;
  }
  return true;
};
const getLabelName = endpoint => {
  const matches = endpoint.match(/label:([a-zA-Z0-9-_]*)/);
  return matches[1];
};

module.exports = {
  setLabels(labels) {
    labelsFromRepo = labels;
  },
  setLabelsInUse(labels) {
    labelsInUse = labels;
  },

  getCalls() {
    return calls;
  },
  reset() {
    labelsFromRepo = [];
    error = '';
    inUseError = '';
    calls = [];
    labelsInUse = [];
  },
  setError(msg, code = 500) {
    error = new Error(msg);
    error.status = code;
  },
  setInUseError(msg, code = 500) {
    inUseError = new Error(msg);
    inUseError.status = code;
  },

  get: jest.fn((endpoint, options) => {
    calls.push({ endpoint, method: 'get', body: '' });
    isAuthorized(options.headers);

    switch (true) {
      case /search/.test(endpoint): {
        if (inUseError !== '') {
          return Promise.reject(inUseError);
        }
        const label = getLabelName(endpoint);
        const found = _.find(labelsInUse, l => l === label) ? 1 : 0;

        return Promise.resolve({ data: { total_count: found }, status: 200 });
      }
      case /labels/.test(endpoint):
        if (error !== '') {
          return Promise.reject(error);
        }
        return Promise.resolve({ data: labelsFromRepo, status: 200 });
      default:
        return Promise.reject(
          new Error(
            `Endpoint: ${endpoint} was not found in the axios mock file.`
          )
        );
    }
  }),

  post: jest.fn((endpoint, body, config) => {
    calls.push({ endpoint, method: 'post', body });

    isAuthorized(config.headers);

    if (error !== '') {
      return Promise.reject(error);
    }

    switch (true) {
      case /labels/.test(endpoint):
        return Promise.resolve({ data: body, status: 201 });
      default:
        return Promise.reject(
          new Error(
            `Endpoint: ${endpoint} was not found in the axios mock file.`
          )
        );
    }
  }),
  patch: jest.fn((endpoint, body, config) => {
    calls.push({ endpoint, method: 'patch', body });
    isAuthorized(config.headers);

    if (error !== '') {
      return Promise.reject(error);
    }

    switch (true) {
      case /labels/.test(endpoint):
        return Promise.resolve({ data: body, status: 200 });
      default:
        return Promise.reject(
          new Error(
            `Endpoint: ${endpoint} was not found in the axios mock file.`
          )
        );
    }
  }),
  delete: jest.fn((endpoint, config) => {
    calls.push({ endpoint, method: 'delete', body: '' });
    isAuthorized(config.headers);

    if (error !== '') {
      return Promise.reject(error);
    }

    switch (true) {
      case /labels/.test(endpoint):
        return Promise.resolve({ data: '', status: 204 });
      default:
        return Promise.reject(
          new Error(
            `Endpoint: ${endpoint} was not found in the axios mock file.`
          )
        );
    }
  })
};
