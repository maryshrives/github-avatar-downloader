var request = require('request');
var secretToken = require('./secrets.js');
var fs = require('fs');

var args = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secretToken.GITHUB_TOKEN
  }
}

  request(options, function(err, res, body) {
    var parsed = JSON.parse(body);
    console.log(parsed);
    cb(err, parsed);
  });
}

function getAvatarUrl(contributors) {
  contributors.forEach(function(contributors) {
    console.log(contributors.avatar_url);
  })
}

function downloadImageByURL(url, filePath) {
  request.get(url + '/' + filePath)
       .on('error', function (err) {
         throw err;
         console.log('We\'ve encountered an error; sorry!');
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream("./avatars/" + filePath + '.jpg'));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
//  console.log("Result:", result);
  getAvatarUrl(result);
  downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
});