/*
 * It calculates the tag of the flavour according to the action:
 *   * release
 *   * prerelease
 *   * workflow_dispatch
 *   * branch_<branch_name>
 *   * particular tag
 *
 */

module.exports = async function(action_type, ctx, octokit){

    switch(action_type){

      case "prerelease":
        return __prerelease(octokit, ctx)

      case "release":
        return __release(octokit, ctx)

      case "workflow_dispatch":
        return ctx.tags

      default:
        if(action_type.match(/^branch_/)){
          return __last_branch_commit(action_type, octokit, ctx)
        }
        else{
          // directly is a particular version (i.e v1.0.1)
          return action_type
        }
    }
}

  function __release(octokit, ctx){

    return ctx.event_payload.release.tag_name

  }

  function __prerelease(octokit, ctx){

    return ctx.event_payload.release.tag_name

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
