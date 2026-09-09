export type SocialProvider = 'GOOGLE' | 'FACEBOOK' | 'TWITTER' | 'GITHUB' | 'LINKEDIN'

export interface UserResponse {
  userId: string
  email: string
  name: string
  linkedSocialAccounts: SocialProvider[]
  createdAt: string
}

