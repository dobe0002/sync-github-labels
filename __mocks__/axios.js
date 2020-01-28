let labelsFromRepo = [];
let error = '';
let calls = [];

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
    calls.push(endpoint);
    if (
      !options.headers ||
      !options.headers.Authorization ||
      options.headers.Authorization === ''
    ) {
      this.setError('Not Authorized', 401);
    }
    if (error !== '') {
      return Promise.reject(error);
    }

    switch (true) {
      case /labels/.test(endpoint):
        return Promise.resolve({ data: labelsFromRepo, status: 200 });
      default:
        return Promise.resolve({ data: labelsFromRepo, status: 200 });
    }
  })
};
/*

    switch (true) {
      case /myBadOrg/.test(endpoint):
        const errorOrg = new Error('Bad org');
        errorOrg.status = 404;
        return Promise.reject(errorOrg);

      case /myBadBranch/.test(endpoint):
        const errorBranch = new Error('Bad Branch');
        errorBranch.status = 404;
        return Promise.reject(errorBranch);

      case /myBadTemplate/.test(endpoint):
        const errorFile = new Error('Bad file');
        return Promise.reject(errorFile);

      case /myErrorFile/.test(endpoint):
        const error = new Error('bad file');
        error.status = 418;
        return Promise.reject(error);

      case /myBadCheckBranch/.test(endpoint):
        const errorCheck = new Error('Branch not found');
        errorCheck.status = 404;
        return Promise.reject(errorCheck);

      case /enforce_admins/.test(endpoint):
        return Promise.resolve({ data: enforceAdmin, status: 200 });

      case /issues/.test(endpoint):
        return Promise.resolve({ data: issues, status: 200 });

      case /contents/.test(endpoint):
        const re = /contents\/([a-zA-Z0-9/._-]+)\?*[a-zA-Z0-9=_-]*$/g;
        const results = re.exec(endpoint);
        const file = results[1];
        if (templateFile[file] === undefined) {
          const error = new Error('not found');
          error.status = 404;
          return Promise.reject(error);
        }
        return Promise.resolve({ data: templateFile[file], status: 200 });

      case /labels/.test(endpoint):
        return Promise.resolve({ data: repoLabels, status: 200 });

      case /repos/.test(endpoint):
        return Promise.resolve({ data: repoData, status: 200 });
    }
  })
};


*/
