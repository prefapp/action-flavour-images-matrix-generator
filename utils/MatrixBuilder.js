
module.exports = class {

  constructor({flavours, tag, repository}){

    this.flavours = flavours
    this.tag = tag
    this.repository = repository

  }

  build(){

    const build = this.flavours.map((fl) => {

      return {

        tags: this.__buildTag(fl.flavour),

        build_args: this.__formatBuildArgs(fl.build_args),

        dockerfile: fl.dockerfile,

        git_tags: [],

      }

    })

    return JSON.stringify({

      include: build,

      assets: []

    })


  }


  __calculateFlavourGitTags(flavour){
    

  }
    __buildTag(flavour){

      return `${this.repository}:${this.tag}_${flavour}`
    }

    __formatBuildArgs(build_args){

      return Object.keys(build_args).map((ba) => {

        return `${ba}=${build_args[ba]}`

      }).join("\n")
    }

}
