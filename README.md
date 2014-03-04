# GitHub Issue Extractor
It extracts issues from the specified milestones and output it in .csv format.

## Usage
You need to have an access token in order to use this script. Go to [Settings -> Applications](https://github.com/settings/applications) to generate a new token. Copy and paste it into `configs/github.json` (see `configs/github.sample.json`).

Once you have done that, the following command, for example, will extract issues from milestone 1, 12, 13 in repo yaru22/hello.

```
$ node ./index.js yaru22/hello 1 12 13
```

Make sure you have an access to the repo in case it's a private repo.
