let labelsFromRepo = [];

let error = '';
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

module.exports = {
  setLabels(labels) {
    labelsFromRepo = labels;
  },

  getCalls() {
    return calls;
  },
  reset() {
    labelsFromRepo = [];
    error = '';
    calls = [];
  },
  setError(msg, code = 500) {
    error = new Error(msg);
    error.status = code;
  },

  get: jest.fn((endpoint, options) => {
    calls.push({ endpoint, method: 'get', body: '' });
    isAuthorized(options.headers);

    if (error !== '') {
      return Promise.reject(error);
    }

    switch (true) {
      case /labels/.test(endpoint):
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
    if (
      !config.headers ||
      !config.headers.Authorization ||
      config.headers.Authorization === ''
    ) {
      this.setError('Not Authorized', 401);
    }
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
    if (
      !config.headers ||
      !config.headers.Authorization ||
      config.headers.Authorization === ''
    ) {
      this.setError('Not Authorized', 401);
    }
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
  })
};
