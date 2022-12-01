function randomString(length){
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function mockCommit(){

  return randomString(40)
}

function mockTag({tagName, commit = mockCommit()}){

  return {
    "name": tagName,
    "commit": {
      "sha": commit,
      "url": `https://api.github.com/repos/octocat/Hello-World/commits/${commit}`
    },
    "zipball_url": `https://github.com/octocat/Hello-World/zipball/${tagName}`,
    "tarball_url": `https://github.com/octocat/Hello-World/tarball/${tagName}`,
    "node_id": randomString(12)
  }

}

function mockTags(tags){

  return tags.map(t => mockTag(t))

}

const mockOcktokit = {

  rest:{

    repos: {

      listTags: async function(owner, repo){

      }

    }

  }

}


console.dir(mockTags([{tagName: "v2"}, {tagName: "v1"}]))

