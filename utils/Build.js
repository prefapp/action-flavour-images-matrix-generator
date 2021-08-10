const jsYaml = require("js-yaml")

const BuildFlavour = require("./BuildFlavour.js")

module.exports = class {

  static FROM_MAIN(ctx){

    const octokit = github.getOctokit(ctx.token)
    
    return octokit.rest.repos.getContent({
    
      owner: ctx.owner,

      repo: ctx.repo,

      path: `${ctx.deployment_file}`
    
    }).then(({data}) => {
 
      return Buffer.from(data.content, "base64").toString('utf-8')

      //core.info(`---------`)
      //core.info(JSON.stringify(data, null, 4))
    })

  }

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
