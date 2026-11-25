import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

export type Profile = {
  id: string
  full_name: string
  company: string
  phone: string
  email: string
}

type AuthContextValue = {
  ready: boolean
  user: User | null
  profile: Profile | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: {
    name: string
    email: string
    password: string
    company?: string
    phone?: string
  }) => Promise<string | void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  loginPrompt: string | null
  askLogin: (message?: string) => void
  closeLoginPrompt: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function metaOf(user: User) {
  const meta = user.user_metadata ?? {}
  return {
    full_name: String(meta.full_name ?? meta.name ?? ""),
    company: String(meta.company ?? ""),
    phone: String(meta.phone ?? ""),
  }
}

async function readProfile(user: User): Promise<Profile> {
  const client = supabase
  const email = user.email ?? ""
  const meta = metaOf(user)
  if (!client) {
    return { id: user.id, email, ...meta }
  }
  const { data } = await client
    .from("profiles")
    .select("id, full_name, company, phone")
    .eq("id", user.id)
    .maybeSingle()
  const profile: Profile = {
    id: user.id,
    email,
    full_name: data?.full_name || meta.full_name,
    company: data?.company || meta.company,
    phone: data?.phone || meta.phone,
  }
  const needsWrite =
    !data ||
    data.full_name !== profile.full_name ||
    data.company !== profile.company ||
    data.phone !== profile.phone
  if (needsWrite && (profile.full_name || profile.company || profile.phone)) {
    await client.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      company: profile.company,
      phone: profile.phone,
    })
  }
  return profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [ready, setReady] = useState(false)
  const [loginPrompt, setLoginPrompt] = useState<string | null>(null)

  useEffect(() => {
    const client = supabase
    if (!client) {
      setReady(true)
      return
    }
    client.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null)
      return
    }
    setProfile(await readProfile(session.user))
  }, [session?.user])

  useEffect(() => {
    void refreshProfile()
  }, [refreshProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const client = supabase
    if (!client) throw new Error("Supabase is not configured.")
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) {
      if (/email not confirmed/i.test(error.message)) {
        throw new Error(
          "Email is not confirmed yet. Run supabase/auth.sql in the SQL editor, then try again.",
        )
      }
      throw new Error(error.message)
    }
  }, [])

  const signUp = useCallback(
    async (input: {
      name: string
      email: string
      password: string
      company?: string
      phone?: string
    }) => {
      const client = supabase
      if (!client) throw new Error("Supabase is not configured.")
      const { data, error } = await client.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.name,
            company: input.company ?? "",
            phone: input.phone ?? "",
          },
        },
      })
      if (error) throw new Error(error.message)
      if (data.session) {
        await client.from("profiles").upsert({
          id: data.session.user.id,
          full_name: input.name,
          company: input.company ?? "",
          phone: input.phone ?? "",
        })
        await client.auth.signOut()
      }
      return "Account created. Log in to continue."
    },
    [],
  )

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  const askLogin = useCallback((message?: string) => {
    setLoginPrompt(message ?? "You need to log in to continue.")
  }, [])

  const closeLoginPrompt = useCallback(() => setLoginPrompt(null), [])

  const value = useMemo(
    () => ({
      ready,
      user: session?.user ?? null,
      profile,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      loginPrompt,
      askLogin,
      closeLoginPrompt,
    }),
    [
      askLogin,
      closeLoginPrompt,
      loginPrompt,
      profile,
      ready,
      refreshProfile,
      session?.user,
      signIn,
      signOut,
      signUp,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used within AuthProvider")
  return value
}
