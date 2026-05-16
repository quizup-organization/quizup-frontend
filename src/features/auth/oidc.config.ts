import type {AuthProviderProps} from 'react-oidc-context'

export const oidcConfig: AuthProviderProps = {
    authority: import.meta.env.VITE_OIDC_BASE_URL,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    post_logout_redirect_uri: `${window.location.origin}/`,
    scope: 'openid profile',
    response_type: 'code',
    loadUserInfo: true,
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname)
    },
}

