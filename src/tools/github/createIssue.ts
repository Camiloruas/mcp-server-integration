import { createIssue } from "./githubClient.js"
import {
    CreateGitHubIssueInput,
    CreateGitHubIssueResult
} from "./types.js"

export async function createGitHubIssueTool(
    input: CreateGitHubIssueInput
): Promise<CreateGitHubIssueResult> {
    const { owner, repo, title, body, labels } = input

    const issue = await createIssue(
        owner,
        repo,
        title,
        body,
        labels
    )

    return {
        issueNumber: issue.number,
        title: issue.title,
        url: issue.html_url
    }
}
