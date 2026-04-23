interface Window {
  __ENV__: {
    API_BASE_URL?: string
    GOOGLE_OAUTH_URL?: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_REDIRECT_URI?: string
    [key: string]: string | undefined
  }
}
