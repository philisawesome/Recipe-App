import { useState, useEffect, createContext, useContext } from "react"


interface authcontext {
	loggedIn: boolean;
	login: (t?: string) => void;
	logout: () => void;
}

const defaultContext = {
	loggedIn: false,
	login: (t?: string) => {},
	logout: () => {},
}


const AuthContext = createContext<authcontext>(defaultContext)

export function AuthProvider(props: any) {
	const [loggedIn, setLoggedIn] = useState(false) 

	useEffect(() => {
		// On render, check if auth token is present and not expired
		// (Maybe use cookies storing JWTs later on)

		const token = localStorage.getItem('token')
		if (token) setLoggedIn(true)
	}, [])

	// The login/out functions can be used by login/out buttons.
	// Updates the user's tokens on the client side and updates
	// the loggedin status for the current page

	const login = (token?: string) => {
		// If no token is passed in, check
		// if we already have a valid token
		//
		// NOT SURE if we need the ability to do this
		if (!token) {
			const t = localStorage.getItem('token')
			if (!t) {
				console.log('No token or invalid token')
				return
			}
			setLoggedIn(true)	
		// Store the token to start a session.
		// Ex: logging in for the first time
		} else {
			localStorage.setItem('token', token)
			setLoggedIn(true)	
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
