const fs = require("fs")

const Build = require("../utils/Build.js")

const MatrixBuilder = require("../utils/MatrixBuilder.js")

test('A matrix is properly built', () => {

  const build_data = fs.readFileSync("./fixtures/build.test.yaml")
  const build = new Build(build_data).init()
  console.log(new MatrixBuilder({
    
    flavours: Object.values(build.flavours),

    tag: "3.7.1",

    registry: "prefapp.io/test"
  
  }).build())

  const build_data2 = fs.readFileSync("./fixtures/build5.test.yaml")
  const build2 = new Build(build_data2).init()

  const flavours = build2.withTrigger({
      
    type: "release"
  
  })
  console.log(new MatrixBuilder({
    
    flavours: flavours,

    tag: "v3.7.1",

    registry: "prefapp.io/test"
  
  }).build())


})


