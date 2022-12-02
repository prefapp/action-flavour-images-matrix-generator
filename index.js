const core = require('@actions/core');
// const exec = require('@actions/exec');
const github = require('@actions/github');

const fs = require("fs")

const Build = require("./utils/Build.js")

const ImagesCalculator = require("./utils/ImagesCalculator.js")

const MatrixBuilder = require("./utils/MatrixBuilder.js")

const ContextResolutor = require("./utils/ContextResolutor.js")

async function run(){

  //
  // We create a context to pass to other parts of the system
  //
  const ctx = {

    github_token: core.getInput("token"),

    owner: github.context.payload.repository.owner.login,

    repo: github.context.payload.repository.name,

    triggered_event: github.context.eventName,

    event_payload: github.context.payload,

    actor: github.context.actor,

    master_branch: core.getInput("default_branch"),

    repository: core.getInput("repository"),

    build_file: core.getInput("build_file"),

    flavours: core.getInput("flavours"),

    environment: core.getInput("environment"),

    tags: core.getInput("tags"),

    current_branch: github.context.ref.replace("refs/heads/", ""),

  }

  const octokit = github.getOctokit(ctx.github_token)

  const build = load_build(ctx)

  //
  // we check the flavours to build according to the
  // event that triggered the workflow
  //
  let flavours = []
  let tag = false

  if( ctx.triggered_event == "push" ){

    core.info(`With event push on branch ${ctx.current_branch}`)

    flavours = build.getFlavourswithTrigger({

      type: "push",

      branch: ctx.current_branch

    })

    tag = await ImagesCalculator(`branch_${ctx.current_branch}`, ctx, octokit)
  }
  else if(ctx.triggered_event == "release"){

    if( github.context.payload.release.prerelease ){

      core.info(`With event prerelease`)

      flavours = build.getFlavourswithTrigger({

        type: "prerelease"

      })

      tag = await ImagesCalculator("prerelease", ctx, octokit)
    }
    else{

      core.info(`With event release`)

      flavours = build.getFlavourswithTrigger({

        type: "release"

      })

      tag = await ImagesCalculator("release", ctx, octokit)
    }
  }
  else if( ctx.triggered_event == "pull_request"){

    const branch = github.context.payload.pull_request.head.ref

    core.info(`With event pull_request on branch ${branch}`)

    flavours = build.getFlavourswithTrigger({

      type: "pull_request",

      branch

    })

    tag = await ImagesCalculator(`branch_${branch}`, ctx, octokit)
  }
  else if( ctx.triggered_event == "workflow_dispatch"){

    core.info(`With event workflow_dispatch`)

    const ctx_flavours = ctx.flavours.split(",")

    flavours = build.flavours().filter((f) => ctx_flavours.includes(f))

    tag = await ImagesCalculator("workflow_dispatch", { ctx, flavour_to_build: flavours }, octokit)

  }
  else{

    core.setFailed("Unknown triggered event")
  }

  const matrix = new MatrixBuilder({

    flavours,

    tag,

    repository: ctx.repository

  }).build()

  core.info(matrix)

  core.setOutput("matrix", matrix)

}

function load_build(ctx){

  const build_file = ctx.build_file

  return new Build(fs.readFileSync(build_file), ContextResolutor).init()
}

run()
