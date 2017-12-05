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
//this is printing out all the user objects
//    console.log(parsed);
    cb(err, parsed);
  });
}

// function getAvatarUrl(contributors) {
//   contributors.forEach(function(contributors) {
//     console.log(contributors.avatar_url);
//   })
// }

function downloadImageByURL(url, filePath) {
  request.get(url + '/' + filePath)
    .on('error', function (err) {
      throw err;
      console.log('We\'ve encountered an error; sorry!');
    })
    .on('response', function (response) {
//this is printing the response code for every entry
//      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream("./" + filePath))
    .on('finish', function() {
      console.log('Downloads complete');
    })
}

getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Error: ", err);
  result.forEach( function(contributor) {
    downloadImageByURL(contributor['avatar_url'] + "avatars/", contributor['login'] + ".jpg");
  });
})