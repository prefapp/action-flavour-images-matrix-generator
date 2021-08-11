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
