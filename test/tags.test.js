const GitTagsCalculator = require("../utils/GitTagsCalculator.js")

test('Get last commit from branch',async () => {

    const ctx = {

        github_token: "my_token",

        owner: "prefapp",

        repo: "my-repo-test",

        current_branch: "main",

    }

    const octokit = {

        rest: {

            repos: {

                getCommit: async () => {

                    return {

                        data: {

                            sha: "1234567890abcdef"

                        }

                    }

                }

            }

        }

    }



    const result = await GitTagsCalculator("push", ctx, octokit)

    //expect(result[0].name).toBe("last_build_main_default")
    //expect(result[0].commit).toBe("12345678")

    //expect(result[0].name).toBe("image_main_default")
    //expect(result[0].commit).toBe("12345678")

})
