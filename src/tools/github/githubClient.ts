import axios from "axios"

const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
    }
})

export async function createIssue(
    owner: string,
    repo: string,
    title: string,
    body?: string,
    labels?: string[]
) {
    const response = await githubApi.post(
        `/repos/${owner}/${repo}/issues`,
        {
            title,
            body,
            labels
        }
    )

    return response.data
}
