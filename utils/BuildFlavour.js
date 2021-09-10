let DEFAULT_DOCKERFILE = "Dockerfile"

module.exports = class {

  static SET_DEFAULT_DOCKERFILE(default_dockerfile){

    DEFAULT_DOCKERFILE = default_dockerfile

  }

  constructor({flavour, triggers, build_args, dockerfile = DEFAULT_DOCKERFILE}){

    this.flavour = flavour
    this.triggers = triggers
    this.build_args = build_args || {}
    this.dockerfile =  dockerfile

  }

  hasTrigger({ type, branch }){

    if( type in this.triggers ){

      if( type == "push" || type == "pull_request" ){

        if( this.triggers[type].branches.indexOf( branch ) !== -1 ){

          return true
        }
        else{

          return false
        }

      }
      else {

        return true
      }

    }
    else{

      return false
    }

  }

}
