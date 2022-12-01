module.exports = async function(action_type, ctx, octokit){

    console.log("octokit", octokit)

    switch(action_type){

      case "prerelease":
        return __prerelease(octokit, ctx)
      case "release":
        return __release(octokit, ctx)
      case "workflow_dispatch":
        return "ok"
      default:
        if(action_type.match(/^branch_/)){
          return await __last_branch_commit(octokit, ctx, "default")
        }
        else{
          return action_type
        }
    }
}

async function __last_branch_commit(octokit, ctx, flavour){

    const commit = await octokit.rest.repos.getCommit({

        owner: ctx.owner,

        repo: ctx.repo,

        ref: ctx.current_branch

    })

    return  {

        name: `last_build_${ctx.current_branch}_${flavour}`,

        commit: commit.data.sha

    }

}
