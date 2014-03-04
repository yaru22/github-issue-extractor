'use strict';

/**
 * Usage:
 *   node ./index.js <repo path> <milestone number 1> <milestone number 2> ...
 *
 *   e.g.
 *   node ./index.js yaru22/hello 1 12 13
 */
var fs = require('fs'),
    request = require('request'),
    util = require('util');

var github = require('./configs/github');

var OUTPUT_FILE = 'invoice-tasks.csv',
    ISSUES_API_URL = 'https://api.github.com/repos/%s/issues?milestone=%s&state=closed&access_token=%s';

var repoPath = process.argv[2],
    rowCount = 1;

fs.writeFileSync(OUTPUT_FILE, ',Issue #,Title,Total Hours,Invoice Item\n');
rowCount++;

process.argv.slice(3).map(function (milestone) {
  var issuesUrl = util.format(ISSUES_API_URL, repoPath, milestone, github.accessToken);
  request({
    url: issuesUrl,
    json: true,
    headers: {
      'User-Agent': 'Node.js Request'
    }
  }, function (err, resp, body) {
    if (err || resp.statusCode !== 200) {
      console.error(err, resp);
      return;
    }

    console.log('Fetched milestone', milestone);
    fs.appendFileSync(OUTPUT_FILE, util.format('"%s",,,,\n', body[0].milestone.title));
    rowCount++;

    body.map(function (issue) {
      fs.appendFileSync(OUTPUT_FILE, util.format(',"%s","%s",,"=""#"" & B%s & "": "" & C%s"\n',
          issue.number,
          issue.title.replace(/"/g, '\''),
          rowCount,
          rowCount));
      rowCount++;
    });
  });
});
