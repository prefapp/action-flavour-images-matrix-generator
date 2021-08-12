
module.exports = class {

  constructor({flavours, tag}){

    this.flavours = flavours
    this.tag = tag

  }

  build(){

    const build = this.flavours.map((fl) => {
    
      return {
      
        tags: this.__buildTag(fl.flavour),

        build_args: this.__formatBuildArgs(fl.build_args),

        dockerfile: fl.dockerfile

      }
    
    })

    return JSON.stringify(build, null, 4)


  }

    __buildTag(flavour){

      return `${this.tag}_${flavour}`
    }

    __formatBuildArgs(build_args){

      return Object.keys(build_args).map((ba) => {
      
        return `${ba}=${build_args[ba]}`

      }).join("\n")
    }

}
