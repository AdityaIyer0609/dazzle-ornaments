import { useAuth } from "../auth/AuthContext"
import { AppLink } from "./AppLink"

export function LoginPrompt() {
  const { loginPrompt, closeLoginPrompt } = useAuth()
  if (!loginPrompt) return null

  return (
    <div className="login-prompt" role="dialog" aria-modal="true" aria-labelledby="login-prompt-title">
      <button
        type="button"
        className="login-prompt-scrim"
        aria-label="Close"
        onClick={closeLoginPrompt}
      />
      <div className="login-prompt-card">
        <p className="eyebrow">Members only</p>
        <h2 id="login-prompt-title">{loginPrompt}</h2>
        <p>Log in or create an account to open designs, cart and order history.</p>
        <div className="login-prompt-actions">
          <AppLink
            page="account"
            className="button dark-button"
            onNavigate={closeLoginPrompt}
          >
            Log in
          </AppLink>
          <button type="button" className="text-link" onClick={closeLoginPrompt}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
