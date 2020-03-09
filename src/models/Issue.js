class Issue {
  constructor(obj = {}) {
    this.issueUrl = obj.html_url || '';
    this.issueNumber = obj.number;
    this.issueLastUpdate = obj.updated_at;
    this.issueCreated = obj.created_at;
    this.isIssueOpen = obj.state === 'open';
    this.issueTitle = obj.title;
  }

  get name() {
    return this.issueTitle;
  }

  get number() {
    return this.issueNumber;
  }

  get url() {
    return this.issueUrl;
  }

  get isOpen() {
    return this.isIssueOpen;
  }
}

module.exports = Issue;
