export interface CreateGitHubIssueInput {
    owner: string
    repo: string
    title: string
    body?: string
    labels?: string[]
}

export interface CreateGitHubIssueResult {
    issueNumber: number
    title: string
    url: string
}
