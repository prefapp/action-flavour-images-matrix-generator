const fs = require("fs")

const Build = require("../utils/Build.js")

const MatrixBuilder = require("../utils/MatrixBuilder.js")

test('A matrix is properly built', () => {

  const build_data = fs.readFileSync("./fixtures/build.test.yaml")

  const build = new Build(build_data).init()

  console.log(new MatrixBuilder(build.flavours).build())

})


