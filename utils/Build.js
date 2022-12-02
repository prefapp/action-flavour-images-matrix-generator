const jsYaml = require("js-yaml")

const BuildFlavour = require("./BuildFlavour.js")
const validateYamlSchema = require("./BuildValidate.js")

/*
 * This class is responsible of deciding WHICH flavours are to be built. 
 * It analyzes the triggers and, according to the data (build-images.yaml).
 * returns a list of flavours. 
 *
 */

module.exports = class {

  constructor(data, contextResolutor = function(){ throw "CONTEXT_RESOLUTOR_UNDEFINED"}){

    this.data = data

    // It's a function that solves an env|secret reference
    // or dies if not defined
    this.contextResolutor = contextResolutor 

    this.__flavours = {}

  }

  /*
   * this method filters the flavours with a particular trigger
   *
   */
  getFlavourswithTrigger(trigger){

   return  Object.values(this.__flavours)
      
      .filter( f => f.hasTrigger(trigger))
  }

  /*
   *
   * It returns all the flavours
   *
   */
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
