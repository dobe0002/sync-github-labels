const axios = require('axios');

class Git {
  constructor(token, gitUrl = '') {
    this.gitToken = token || '';
    this.gitUrl = gitUrl;
  }

  set url(url) {
    this.gitUrl = url;
  }

  set token(token) {
    this.gitToken = token;
  }

  _isReady() {
    return this.gitToken !== '' && this.gitUrl !== '';
  }

  async getLabels(owner, repoName) {
    if (
      !this._isReady() ||
      owner === undefined ||
      owner === '' ||
      repoName === undefined ||
      repoName === ''
    ) {
      return Promise.resolve(
        new Error('Repo, token, or github url is not set ')
      );
    }
    const endpoint = `${this.gitUrl}/repos/${owner}/${repoName}/labels`;
    return axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${this.gitToken}`,
        Accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
  }

  async addLabel(owner, repoName, label) {
    if (!this._isReady()) {
      return Promise.resolve(new Error('No Github token or url set'));
    }

    const endpoint = `${this.gitUrl}/repos/${owner}/${repoName}/labels`;
    // expect a response of 201
    return axios.post(endpoint, label.toObject, {
      headers: {
        Authorization: `Bearer ${this.gitToken}`,
        Accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
  }

  async editLabel(owner, repoName, label) {
    if (!this._isReady()) {
      return Promise.resolve(new Error('No Github token or url set'));
    }

    const endpoint = `${this.gitUrl}/repos/${owner}/${repoName}/labels/${label.name}`;
    // expect a response of 201
    return axios.patch(endpoint, label.toObject, {
      headers: {
        Authorization: `Bearer ${this.gitToken}`,
        Accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
  }

  async deleteLabel(owner, repoName, label) {
    if (!this._isReady()) {
      return Promise.resolve(new Error('No Github token or url set'));
    }

    const endpoint = `${this.gitUrl}/repos/${owner}/${repoName}/labels/${label.name}`;
    return axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${this.gitToken}`,
        Accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
  }

  async isLabelInUse(owner, repoName, label, onlyActive = false) {
    if (!this._isReady()) {
      return Promise.resolve(new Error('No Github token or url set'));
    }

    let endpoint = `${this.gitUrl}/search/issues?q=repo:${owner}/${repoName}+label:${label.name}`;
    if (onlyActive) {
      endpoint += '+is:open';
    }
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${this.gitToken}`,
        Accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
    // TODO catch errors
    return !!(response.data.total_count && response.data.total_count > 0);
  }
}

module.exports = Git;
