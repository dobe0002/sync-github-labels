# Sync GitHub Labels

This command line application will sync labels between GitHub repositories. This ensures that all repos have the same set of labels.

**Note:** All the repositories need to be in the same instance of GitHub. For example you cannot sync labels with repositories on both `https://github.com` and `https:github.umn.edu`.

## Set up

1. Download/clone this repository from GitHub
1. In a terminal, navigate to the root of the project
1. Run `npm install --production`
1. Copy `config.example.json` to `config.json` at the root of the project
1. Inside of `config.json` enter the correct GitHub api URL and your [GitHub personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

---

## Master labels

The master labels are the labels that you want included in each repository. You can use the labels from a single repository as the master labels, **OR** you can have a json file that lists the master labels.

### Master labels from repository

You will need both the organization and repository name. For example if the URL for you repository is:

```
https://github.umn.edu/kkd-test-org/Tester_Repo/
```

The owner is `kkd-test-org` and the name is `Tester_Repo`.

### Master labels from a JSON file

The JSON file will need to be formatted this way:

```
{
  "labels":[
    {
      "name":"label name",
      "description":"Longer description of the label",
      "color":"004400"
    },
    {
      "name":"label name",
      "description":"Longer description of the label",
      "color":"004400"
    }
  ]
}
```

You will need to know the relative path from the root of the project to your JSON file.

---

## Output repositories

Output repositories where the master labels will be added (or edited). You can simply list the owner/name of the repositories **OR** list the repositories in a JSON file.

### Output repositories array

You will need both the organization and repository name for each repository. For example if the URL for you repository is:

```
https://github.umn.edu/kkd-test-org/Tester_Repo/
```

The owner is `kkd-test-org` and the name is `Tester_Repo`.

The array would look like this:

```
[
  'kkd-test-org/Tester_Repo',
  'anotherOrg/Another_Repo
]
```

## Output repository JSON file

The JSON file will need to be formatted this way:

```
{
  "outputRepos": [
    "kkd-test-org/AAA_Tester",
    "kkd-test-org/BBB_Tester"
  ]
}

```

You will need to know the relative path from the root of the project to your JSON file.

---

## Making a sync

To call the syncing script, in a terminal, navigation to the root of the project then type  one of hte the following:

```
node sync.js
```
OR
```
npm run sync -- 
```

Most likely, this won't work because you need to pass in the master labels and output repositories. There are numerous flags you can add. All of them are available by using the help flag: `node sync.js --help`

| Option            | description                                                                                                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--inputFile`     | Path to a local JSON file containing label information. Use this feature **OR** `--inputRepo`                                                                                                                                       |
| `--inputRepo`     | The owner/repo for the GitHub repo that contains the labels you would like to copy from. Use this feature **OR** `--inputFile`                                                                                                      |
| `--outputRepos`   | Owner/repo for the GitHub repo that will be synced. Note: You can pass multiple outputRepos flags. Example: `--inputRepo kkd-test-org/Holder_Repo --outputRepos kkd-test-org/AAA_Tester`. Use this feature **OR** `--outputRepFile` |
| `--outputRepoFile` | Path to file that contains an array of owner/repo for the GitHub repos that will be synced. Use this feature **OR** `--outputRepos`                                                                                                 |
| `--sync`          | When set to true, the script will remove labels not listed in the master labels file/repo and are not in use in the output repo.                                                                                                    |
| `--syncForce`     | When set, all labels that are not listed in the master labels file/repo will be removed, regardless if they are used or not. This flag should be used with the `--sync` flag.                                                       |

---

## Version

To get the version of the sync-github-labels script, run the following in an terminal: `node sync.js --version`
