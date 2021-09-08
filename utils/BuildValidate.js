var Validator = require('jsonschema').Validator;

const FlavourSchema = {

  id: "/FlavourSchema",

  type: "object",

  properties: {
    triggers: {}
  }

}


module.exports = function(unvalidatedJson){

  var validator = new Validator();
  var schema = {
    
        "type": "object"
  
      };

  return validator.validate(unvalidatedJson, schema);

}
