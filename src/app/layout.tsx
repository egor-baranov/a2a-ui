// app/layout.tsx
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import {AuthProvider} from "@/providers/AuthProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "svgen",
	description: "AI generation service for vector images like logos and icons",
};

export default function RootLayout({
																		 children,
																	 }: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
		<head/>
		<body>
		<AuthProvider>
			{/* Shared header lives inside <body> */}
			<Header/>

			{/* Main content */}

			<main className="mt-16">{children}</main>
		</AuthProvider>
		</body>
		</html>
	);
}
