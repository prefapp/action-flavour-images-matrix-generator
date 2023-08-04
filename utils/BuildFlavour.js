let DEFAULT_DOCKERFILE = "Dockerfile"

const IS_INTERPOLABLE = new RegExp(/^\$\{\{\s*([^}\s]+)\s*\}\}$/)

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

module.exports = class {

  static SET_DEFAULT_DOCKERFILE(default_dockerfile){

    DEFAULT_DOCKERFILE = default_dockerfile

  }

  constructor({flavour, triggers, build_args, dockerfile = DEFAULT_DOCKERFILE}, contextResolutor){

    this.flavour = flavour
    this.triggers = triggers
    this.dockerfile =  dockerfile


    this.build_args = this.__interpolateBuildArgs(build_args || {}, contextResolutor)

  }

  hasTrigger({ type, branch, release_tag}){

    if( type in this.triggers ){

      if( type == "push" ){

        if( this.triggers[type].branches.indexOf( branch ) !== -1 ){

          return true
        }
        else{

          return false
        }

      }
      else if(release_tag && (type == "release" || type == "prerelease") ){

        if(this.triggers[type].release_tag){

          const reg = new RegExp(this.triggers[type].release_tag)

          return reg.test(release_tag)

        }
        else{

          return true
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

  __interpolateBuildArgs(build_args, contextResolutor){

    const build_args_interpolated = {}

    for(const key in build_args){

      if(IS_INTERPOLABLE.test(build_args[key])){

        // We pass the interpolable value to the context resolutor
        // which is going to use action context to try to resolve its value
        const clean_key = IS_INTERPOLABLE.exec(build_args[key])[1]

        build_args_interpolated[key] = contextResolutor(clean_key)

      }
      else{

        build_args_interpolated[key] = build_args[key]
      }

    }

    return build_args_interpolated

  }

}
