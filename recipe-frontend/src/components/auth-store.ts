import { atom } from 'nanostores'

export type User = {
	username: string
	name: string
}

export const loggedIn = atom(false)
export const userid = atom(false)

export const login = (token?: string, user?: User) => {
	if (typeof window === 'undefined') return

	// If not all args passed, check
	// if we already have a valid token/user info
	// in our cookies.
	if (!token || !user) {
		const t = localStorage.getItem('token')
		if (!t) { return }
		const u = localStorage.getItem('username')
		if (!u) { return }
		const n = localStorage.getItem('name')
		if (!n) { return }
		loggedIn.set(true)
	// Store the token/userinfo to start a session.
	// Ex: logging in for the first time
	} else {
		localStorage.setItem('token', token)
		localStorage.setItem('username', user.username)
		localStorage.setItem('name', user.name)
		loggedIn.set(true)
	}
}

login()
