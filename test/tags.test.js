const GitTagsCalculator = require("../utils/GitTagsCalculator.js")

test('Get last commit from branch',async () => {

    const ctx = {

        github_token: "my_token",

        owner: "prefapp",

        repo: "my-repo-test",

        current_branch: "main",

    }

    const result = await GitTagsCalculator("branch_main", ctx)
})
