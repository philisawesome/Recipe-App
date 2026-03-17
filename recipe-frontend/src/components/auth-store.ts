import { atom } from 'nanostores'
import Cookies from 'js-cookie'

import axios from "axios"
import { API_URL } from "./utils"

export const api = axios.create();

api.interceptors.response.use(
	(response) => {
		return response;
  	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const res = await axios.post(`${API_URL}/auth/refresh_token`, {}, {
					withCredentials: true // Send httpOnly cookies
				});

				login(res.data.access_token)
				originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`

				return api(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export const NullUser: User = {
	username: "",
	name: "",
	id: "",
}

export type User = {
	username: string
	name: string
	id: "",
}

export const loggedIn = atom(false)
export const my_username = atom('')

export const redirect = atom("")

export const login = (token?: string, user?: User) => {
	if (typeof window === 'undefined') return

	// If not all args passed, check
	// if we already have a valid token/user info
	// in our cookies.
	if (token) {
		localStorage.setItem('token', token)	
	} else {
		if (!localStorage.getItem('token')) return
	}

	if (user) {
		localStorage.setItem('username', user.username)
		localStorage.setItem('name', user.name)
		localStorage.setItem('userid', user.id)
		my_username.set(user.username)
	} else {
		const u = localStorage.getItem('username')
		if (!u) return
		if (!localStorage.getItem('name')) return
		if (!localStorage.getItem('userid')) return
		my_username.set(u)
	}

	loggedIn.set(true)
}

export const logout = async () => {
	const res = await api.post(`${API_URL}/auth/logout`, {}, { withCredentials: true })

	console.log(res)
	localStorage.clear()
	loggedIn.set(false)
	my_username.set('')
}

login()
