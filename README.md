# action-flavour-images-matrix-generator

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>

This action generates a matrix (in json format) that describes which image build jobs must be executed.
It was designed to be used in a workflow as the previous step in a job wiht matrix that builds Docker images with particular flavours. It is conceived to be used in complex workflows with the [matrix strategy](https://docs.github.com/es/actions/learn-github-actions/managing-complex-workflows#using-a-build-matrix) and the "fromJson" method. 

## Usage

You can now consume the action by referencing the v1 branch

```yaml
steps:
  - name: calculate-matrix
    uses: prefapp/action-flavour-images-matrix-generator@v1
    with:
      matrix_output: matrix  # OPTIONAL that is the default value 
      repository: fooacr.azurecr.io/apps/foo/bar
      build_file: .github/build-images.yml  # OPTIONAL that is the default value 
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:


## Documentation

- See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

- Template used for this action: [hello-world-javascript-action] (https://github.com/actions/hello-world-javascript-action)

- If you are new, there's also a simpler introduction.  See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)


## Code in Main

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)
...
```

### Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: