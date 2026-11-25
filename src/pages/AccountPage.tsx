import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { AppLink } from "../components/AppLink"
import { Icon } from "../components/Icon"
import { Page } from "../components/Page"
import { fetchMyOrders, type SavedOrder } from "../lib/backend"
import { formatWeight } from "../data/catalog"

export function AccountPage() {
  const { user, profile, ready, signOut } = useAuth()
  const [orders, setOrders] = useState<SavedOrder[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return
    fetchMyOrders()
      .then(setOrders)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load orders."),
      )
  }, [user])

  if (!ready) {
    return (
      <Page className="page-main auth-shell">
        <section className="wrap auth-page">
          <p className="eyebrow">Account</p>
          <h1>Loading…</h1>
        </section>
      </Page>
    )
  }

  if (!user) {
    return (
      <Page className="page-main auth-shell">
        <section className="wrap auth-page">
          <p className="eyebrow">Account</p>
          <h1>Log in to see your desk.</h1>
          <p className="auth-lead">
            Cart, checkout details and order history are saved to your account.
          </p>
          <AppLink page="account" className="button dark-button">
            Log in or sign up <Icon name="arrow" />
          </AppLink>
        </section>
      </Page>
    )
  }

  return (
    <Page className="page-main">
      <section className="account-page wrap">
        <div className="account-head">
          <div>
            <p className="eyebrow">Your desk</p>
            <h1>{profile?.full_name || "Account"}</h1>
          </div>
          <button type="button" className="text-link" onClick={() => void signOut()}>
            Log out
          </button>
        </div>

        <div className="account-layout">
          <div>
            <section className="profile-card">
              <p className="eyebrow">Profile</p>
              <dl>
                <div>
                  <dt>Name</dt>
                  <dd>{profile?.full_name || "—"}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{profile?.email || user.email || "—"}</dd>
                </div>
                <div>
                  <dt>Company</dt>
                  <dd>{profile?.company || "—"}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{profile?.phone || "—"}</dd>
                </div>
              </dl>
            </section>
            <div className="account-actions">
              <AppLink page="cart" className="button dark-button">
                Open cart <Icon name="bag" />
              </AppLink>
              <AppLink page="collections" className="text-link">
                Catalogue <Icon name="arrow" />
              </AppLink>
            </div>
          </div>
          <div>
            <h2>Order history</h2>
            {error && (
              <p className="qty-error" role="alert">
                {error}
              </p>
            )}
            {!orders.length && !error && (
              <p className="small-note">No orders yet. Place one from the cart.</p>
            )}
            <div className="order-list">
              {orders.map((order) => (
                <article key={order.id} className="order-card">
                  <div>
                    <p className="eyebrow">{order.public_code}</p>
                    <strong className="num">{Number(order.billable_grams).toFixed(2)} g</strong>
                    <small>
                      {new Date(order.created_at).toLocaleString()}
                      {order.total_pcs ? ` · ${order.total_pcs} pcs` : " · custom grams"}
                    </small>
                  </div>
                  <ul>
                    {order.order_items.map((item, index) => (
                      <li key={`${order.id}-${index}`}>
                        {item.product_name} · {formatWeight(Number(item.weight))}
                        {item.custom ? " · custom" : ` · ${item.pcs} pcs`}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
