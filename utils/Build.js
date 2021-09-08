const jsYaml = require("js-yaml")

const BuildFlavour = require("./BuildFlavour.js")
const validateYamlSchema = require("./BuildValidate.js")

module.exports = class {

  constructor(data){

    this.data = data

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

    if (!validateYamlSchema(this.data).valid)
      throw `Error validating structure using json schema!`  

    this.__loadData()

    return this
  }

  __loadData(){

    for(const flavour in this.data ){

      this.__flavours[flavour] = new BuildFlavour({flavour, ...this.data[flavour]})
      
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
