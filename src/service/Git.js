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

  async getLabels(owner, repoName) {
    if (this.gitToken === '') {
      // console.log('No GitHub token was set');
      return new Error('No Github token set');
    }
    const endpoint = `${this.gitUrl}/repos/${owner}/${repoName}/labels`;
    return axios.get(endpoint, {
      headers: {
        Authorization: this.gitToken,
        Accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
  }
}

module.exports = Git;
