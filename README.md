# GitHub Issue Extractor
It extracts issues from the specified milestones and output it in .csv format.

## Sample
Here is [sample.csv](https://raw.github.com/yaru22/github-issue-extractor/master/sample.csv) generated for the [sample milestone](https://github.com/yaru22/github-issue-extractor/issues?milestone=1&page=1&state=closed) with the following command:

```
$ node ./index.js yaru22/github-issue-extractor 1
```

And this is the [corresponding spreadsheet](https://docs.google.com/spreadsheets/d/1uVgtcUwsB9OVrQwUC8oPkcbd3ob00kobhamkGi_0FTI/pubhtml) generated from `sample.csv` above (formatting was done manually).

## Usage
You need to have an access token in order to use this script. Go to [Settings -> Applications](https://github.com/settings/applications) to generate a new token. Copy and paste it into `configs/github.json` (see `configs/github.sample.json`).

Once you have done that, the following command, for example, will extract issues from milestone 1, 12, 13 in repo yaru22/hello.

```
$ node ./index.js yaru22/hello 1 12 13
```

Make sure you have an access to the repo in case it's a private repo.
