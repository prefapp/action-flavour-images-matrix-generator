const fs = require("fs")

const Build = require("../utils/Build.js")

test('Build loads correctly a build.yaml', () => {

  const build_data = fs.readFileSync("./fixtures/build.test.yaml")

  const build = new Build(build_data).init()

  expect(build.flavours["my-flavour"]).toMatchObject({
  
    flavour: "my-flavour",

    triggers: {},

    build_args: {

      APP: "foo",

      App2: "lol"
    }

    
  })


})


test('Fail validation with json schema Dockerfile', () => {

  const build_data = fs.readFileSync("./fixtures/build3.test.yaml")

  expect(() => {
    
    new Build(build_data).init()

  }).toThrow("Error validating structure using json schema! ERR: instance.default.dockerfile is not of a type(s) string");

})


test('Fail validation with json schema branches not array', () => {

  const build_data = fs.readFileSync("./fixtures/build4.test.yaml")

  expect(() => {
    
    new Build(build_data).init()

  }).toThrow("Error validating structure using json schema! ERR: instance.my-fourth-flavour.triggers.pull_request.branches is not of a type(s) array");

})



test('Build get flavours by trigger', () => {

  const build_data = fs.readFileSync("./fixtures/build.test.yaml")

  const build = new Build(build_data).init()

  let flavours = build.withTrigger({
  
    type: "push",

    branch: "main"
  
  })

  expect(flavours.length).toBe(2)
  
  expect(flavours[0].flavour).toBe("my-flavour")

  flavours = build.withTrigger({
  
    type: "release",
  
  })

  expect(flavours.length).toBe(3)

})


test('Build get flavours by pre-release trigger', () => {

  const build_data = fs.readFileSync("./fixtures/build.test.yaml")

  const build = new Build(build_data).init()

  let flavours = build.withTrigger({
  
    type: "prerelease",
  
  })

  expect(flavours[0].flavour).toBe("my-fourth-flavour")

  expect(flavours.length).toBe(2)

})

test('Build performs values interpolation', () => {

  const build_data = fs.readFileSync("./fixtures/build5.test.yaml")

  const build = new Build(build_data, function(value){

    // mock of context resolutor
    if(value === "${{secret.PAT}}"){
      return "my-important-secret"
    }
    else{

      throw `UNKONW VAR ${value}`
    }

  }).init()

  let flavours = build.withTrigger({
  
    type: "push",

    branch: "main"
  
  })

  expect(flavours[0].flavour).toBe("my-flavour")

  expect(flavours[0].build_args).toEqual({

    APP: "foo",
    App2: "lol",
    PAT: "my-important-secret"

  })
})
