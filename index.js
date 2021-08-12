const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

const fs = require("fs")

const Build = require("./utils/Build.js")

const ImagesCalculator = require("./utils/ImagesCalculator.js")

const MatrixBuilder = require("./utils/MatrixBuilder.js")

async function run(){

  //
  // We create a context to pass to other parts of the system
  //
  const ctx = {

    github_token: core.getInput("github_token"),

    //
    // This is the token we use to dispatch
    // It is different from the github_token, because we need to trigger another action
    // in another repo. 
    //
    token: core.getInput('token'),
   
    owner: github.context.payload.repository.owner.login,

    repo: github.context.payload.repository.name,

    triggered_event: github.context.eventName,

    actor: github.context.actor,

    master_branch: core.getInput("default_branch"),

    matrix_output: core.getInput("matrix_output"),

    current_branch: github.context.ref.replace("refs/heads/", ""),
  
  }

  const build = load_build(ctx)

  //
  // we check the flavours to build according to the  
  // event that triggered the workflow
  //
  let flavours = []
  let tag = false

  if( ctx.triggered_event == "push" ){
      
    flavours = build.withTrigger({

      type: "push",

      branch: ctx.current_branch

    })

    tag = await ImagesCalculator(`branch_${ctx.current_branch}`, ctx)
  }
  else if(ctx.triggered_event == "release"){

    if( github.context.payload.release.prerelease ){
    
      flavours = build.withTrigger({
      
        type: "prerelease"
      
      })

      tag = await ImagesCalculator("prerelease", ctx)
    }
    else{

      flavours = build.withTrigger({
      
        type: "release"
      
      })

      tag = await ImagesCalculator("release", ctx)
    }
  }
  else if( ctx.triggered_event == "pull_request"){

    const branch = github.context.payload.pull_request.head.ref

    flavours = build.withTrigger({
    
      type: "pull_request",

      branch
    
    })

    tag = await ImagesCalculator(`branch_${branch}`, ctx)
  }
  else{

    core.setFailed("Unknown triggered event")
  }

  const matrix = new MatrixBuilder({flavours, tag}).build()

  core.setOutput(ctx.matrix_output, matrix)
  

}

run()
