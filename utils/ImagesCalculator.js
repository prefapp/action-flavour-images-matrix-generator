// const core = require("@actions/core")
const github = require("@actions/github")

module.exports = async function(action_type, ctx){

    const octokit = github.getOctokit(ctx.github_token)
  
    switch(action_type){
  
      case "prerelease":
        return __prerelease(octokit, ctx)
      case "release":
        return __release(octokit, ctx)
      default:
        if(action_type.match(/^branch_/)){
          return __last_branch_commit(action_type, octokit, ctx)
        }
        else{
          return action_type
        }
    }
}


  function __release(octokit, ctx){

    return ctx.triggered_event.tag_name
    
  }

  function __prerelease(octokit, ctx){

    return ctx.triggered_event.tag_name

  }

  function __last_branch_commit(branch, octokit, ctx){

    return octokit.rest.repos.getBranch({
    
      owner: ctx.owner,

      repo: ctx.repo,

      branch: branch.replace(/^branch_/, "")
    
    }).then((b) => {
    
      //
      // we only use the first 8 chars of the commit's SHA for tagging
      //
      return b.data.commit.sha.substring(0, 7) 

    })

  }
