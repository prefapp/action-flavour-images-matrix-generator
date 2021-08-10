module.exports = class {

  constructor({flavour, triggers, build_args}){

    this.flavour = flavour
    this.triggers = triggers
    this.build_args = build_args

  }

  hasTrigger({ type, branch }){

    if( type in this.triggers ){

      if( type == "push" ){

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
