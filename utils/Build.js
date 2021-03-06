const jsYaml = require("js-yaml")

const BuildFlavour = require("./BuildFlavour.js")
const validateYamlSchema = require("./BuildValidate.js")

module.exports = class {

  constructor(data, contextResolutor = function(){ throw "CONTEXT_RESOLUTOR_UNDEFINED"}){

    this.data = data

    // It's a function that solves an env|secret reference
    // or dies if not defined
    this.contextResolutor = contextResolutor 

    this.__flavours = {}

  }

  withTrigger(trigger){

   return  Object.values(this.__flavours)
      
      .filter( f => f.hasTrigger(trigger))
  }

  get flavours(){

    return this.__flavours
  }

  init(){

    this.data = this.__loadYaml(this.data)

    const validation = validateYamlSchema(this.data);
    if (!validation.valid)
      throw `Error validating structure using json schema! ERR: ${validation.errors}`   

    this.__loadData()

    return this
  }

  __loadData(){

    for(const flavour in this.data ){

      this.__flavours[flavour] = new BuildFlavour({

        flavour, 

        ...this.data[flavour]

      }, this.contextResolutor)
      
    }

  }

  __loadYaml(yamlData){

    let data

    try{

      data = jsYaml.load(yamlData)

    }
    catch(err){

      throw `Error loading yaml: ${err}`
    }

    return data

  }



}
