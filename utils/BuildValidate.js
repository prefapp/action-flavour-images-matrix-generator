var Validator = require('jsonschema').Validator;

module.exports = function(unvalidatedJson){

  const BuildImagesSchema = {

    id: "/deployment-schema",
    type: "object",
  
    patternProperties: {
      "^.+$" : {
        "$ref": "/flavour-schema"
      }
    }
  }
  
  const FlavourSchema = {
    id: "/flavour-schema",
    type: "object",
    
    properties: {
      "triggers": {
        "$ref": "/triggers-schema"
      },
      "build_args": {
        type: "object",
        patternProperties: {
          type: "string"
        }
      },
      "dockerfile": {
        type: "string"
      }
  
    },
  
    required: ["triggers"],
    additionalProperties: false
  }

  const TriggersSchema = {
    id: "/triggers-schema",
    
    type: "object",
    properties: {
      "release": {},
      "prerelease": {},
      "push": {
        type: "object",
        properties: {
          "branches": { 
            type: "array",
            items: {"type": "string"},
          }
        }
      },
      "pull_request": {
        type: "object",
        properties: {
          "branches": { 
            type: "array",
            items: {"type": "string"},
          }
        }
      }
    },
    additionalProperties: false
  }
 
  var validator = new Validator();
  validator.addSchema(TriggersSchema)
  validator.addSchema(FlavourSchema)
  
  return validator.validate(unvalidatedJson, BuildImagesSchema);

}
