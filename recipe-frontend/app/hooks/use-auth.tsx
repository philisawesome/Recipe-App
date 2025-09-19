import { useState, useEffect, createContext, useContext } from "react"
import { type User } from "../lib/utils"


interface authcontext {
	loggedIn: boolean
	user?: User
	login: (t?: string, user?: User) => void
	logout: () => void
}

const defaultContext: authcontext = {
	loggedIn: false,
	login: () => {},
	logout: () => {},
}


const AuthContext = createContext<authcontext>(defaultContext)

export function AuthProvider(props: any) {
	const [loggedIn, setLoggedIn] = useState(false) 
	const [user, setUser] = useState<User>() 

	useEffect(() => {
		// On render, check if auth token is present and not expired
		// (Maybe use cookies storing JWTs later on)

		login()
	}, [])

	// The login/out functions can be used by login/out buttons.
	// Updates the user's tokens on the client side and updates
	// the loggedin status for the current page

	const login = (token?: string, user?: User) => {
		// If no token is passed in, check
		// if we already have a valid token
		// in our cookies
		if (!token || !user) {
			const t = localStorage.getItem('token')
			if (!t) {
				return
			}
			const u = localStorage.getItem('user')
			if (!u) {
				return
			}
			try {
				setUser(JSON.parse(u))
			} catch {
				return
			}
			setLoggedIn(true)	
		// Store the token to start a session.
		// Ex: logging in for the first time
		} else {
			localStorage.setItem('token', token)
			localStorage.setItem('user', JSON.stringify(user))
			setLoggedIn(true)
			setUser(user)
		}
	}

	const logout = () => {
		// Remove token
		localStorage.removeItem('token')
		setLoggedIn(false)
		window.location.reload() // see TODO above func
	}

	const contextValue = {
		loggedIn: loggedIn,
		user: user,
		login: login,
		logout: logout,
	}

	return (
		<AuthContext.Provider value={contextValue} {...props}/>
	)
}


// Hook to use in any component that needs authorization
export function useAuth() {
	const context = useContext(AuthContext)
	return context
}
