"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

// Define shape of authentication data
interface AuthData {
	token: string;
	username: string;
}

// Context value interface
interface AuthContextType {
	auth: AuthData | null;
	login: (token: string, username: string, remember?: boolean) => void;
	logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
	children: ReactNode;
	/**
	 * Cookie maxAge in seconds. Defaults to 30 days.
	 */
	maxAge?: number;
	/**
	 * Cookie path. Defaults to '/'.
	 */
	path?: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, maxAge = 30 * 24 * 60 * 60, path = '/' }) => {
	const [auth, setAuth] = useState<AuthData | null>(null);

	// On mount, read cookies
	useEffect(() => {
		const cookies = parseCookies();
		const token = cookies['auth_token'];
		const username = cookies['auth_username'];

		if (token && username) {
			setAuth({ token, username });
		}
	}, []);

	// Login: store cookie & update state
	const login = (token: string, username: string, remember: boolean = true) => {
		const options = { maxAge: remember ? maxAge : undefined, path };
		setCookie(null, 'auth_token', token, options);
		setCookie(null, 'auth_username', username, options);
		setAuth({ token, username });
	};

	// Logout: clear cookies & state
	const logout = () => {
		destroyCookie(null, 'auth_token');
		destroyCookie(null, 'auth_username');
		setAuth(null);
	};

	return (
		<AuthContext.Provider value={{ auth, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
