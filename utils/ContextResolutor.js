/*
 * A function that receives a string with a dot key foo.v1.v2
 * and searches in the github context of the Action for its value. 
 *
 * If nothing is found it throws an Exception. 
 *
 * Args:
 *   - key(string): a dotted key to search for its value
 * Returns:
 *   - value(string): the correspondant value
 */

module.exports = function(key){

  let resolved = false

  for(const level of key.split(/\./)){

    if(resolved === false){

      resolved = __getResolutor(level)
    
    }
    else{
    
      if(!resolved[level]){

        throw `COULD NOT RESOLVE ${key}`
      }

      resolved = resolved[level]

    }


  }

  return resolved

}

  function __getResolutor(level){

    switch(level){

      case "env":
        return process.env
      default:
        throw `UNKNOW_RESOLUTOR ${level}`

    }
  }
