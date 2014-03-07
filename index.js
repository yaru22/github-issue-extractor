'use strict';

/**
 * Usage:
 *   node ./index.js <repo path> <milestone number 1> <milestone number 2> ...
 *
 *   e.g.
 *   node ./index.js yaru22/github-issue-extractor 1 12 13
 */

var _       = require('lodash'),
    async   = require('async'),
    request = require('request'),
    util    = require('util');

var accessToken;
try {
  var githubConfig = require('./configs/github');
  accessToken = githubConfig.accessToken;
} catch (err) {
  accessToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!accessToken) {
    console.log('GitHub access token is not available. Please set it via GITHUB_ACCESS_TOKEN environment variable.');
    process.exit(1);
  }
}

var ISSUES_API_URL = 'https://api.github.com/repos/%s/issues?milestone=%s&state=closed&access_token=%s';

var repoPath         = process.argv[2],
    milestoneNumbers = process.argv.slice(3);

function collectIssues(outputFunction) {
  async.map(milestoneNumbers, function (milestone, done) {
    var issuesUrl = util.format(ISSUES_API_URL, repoPath, milestone, accessToken);
    request({
      url: issuesUrl,
      json: true,
      headers: {
        'User-Agent': 'Node.js Request'
      }
    }, function (err, resp, body) {
      if (err || resp.statusCode !== 200) {
        console.log(err, resp);
        return;
      }

      var milestoneObj = {};
      milestoneObj.title = body[0].milestone.title;
      milestoneObj.issues = [];

      body.map(function (issue) {
        var estimateMatcher = /total estimate hours: (\d+(\.\d+)?) hours/m;

        var issueNumber = issue.number,
            issueTitle = issue.title.replace(/"/g, '\''),
            issueEstimate = issue.body.toLowerCase().match(estimateMatcher);
        if (issueEstimate) {
          issueEstimate = parseFloat(issueEstimate[1]);
        }

        milestoneObj.issues.push({
          number: issueNumber,
          title: issueTitle,
          estimate: issueEstimate
        });
      });

      return done(null, milestoneObj);
    });
  }, function (err, results) {
    if (err) {
      console.log(err);
    }
    outputFunction(results);
  });
}

var outputFunctions = {};

outputFunctions.all = function (data) {
  console.log('===== JSON format =====');
  outputFunctions.json(data);
  console.log('\n===== CSV format =====');
  outputFunctions.csv(data);
};

outputFunctions.json = function (data) {
  console.log(JSON.stringify(data, null, 2));
};

outputFunctions.csv = function (data) {
  var rowCount = 1;

  // Print the header.
  console.log(',Issue #,Title,Total Hours,Invoice Item');
  rowCount++;

  _.each(data, function (milestone) {
    console.log(util.format('"%s",,,,', milestone.title));
    rowCount++;

    _.each(milestone.issues, function (issue) {
      console.log(
        util.format(',"%s","%s","%s","=""#"" & B%s & "": "" & C%s"',
            issue.number,
            issue.title,
            issue.estimate,
            rowCount,
            rowCount)
      );
      rowCount++;
    });
  });
};

collectIssues(outputFunctions.all);
