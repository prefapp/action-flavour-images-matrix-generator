
module.exports = class {

  constructor(flavours){

    this.flavours = flavours

  }

  build(){

    const build = Object.values(this.flavours).map((fl) => {
    
      return {
      
        tags: fl.flavour,

        build_args: this.__formatBuildArgs(fl.build_args),

        dockerfile: fl.dockerfile

      }
    
    })

    return JSON.stringify(build, null, 4)

  }

    __formatBuildArgs(build_args){

      return Object.keys(build_args).map((ba) => {
      
        return `${ba}=${build_args[ba]}`

      }).join("\n")
    }

}
