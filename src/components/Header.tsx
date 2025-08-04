"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {SparklesIcon, MenuIcon, XIcon} from "lucide-react";
import {useAuth} from "@/providers/AuthProvider";

const navItems = [
	{label: "Create", href: "/create"},
	{label: "Explore", href: "/explore"},
	{label: "Plans", href: "/plans"},
	{label: "Sign In", href: "/auth"},
	{label: "Account", href: "/account"},
];

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	const {auth, logout} = useAuth();

	useEffect(() => {
		if (auth == null) return;
		if (auth?.token != null && pathname === "/auth") {
			router.push("/account");
		}
	}, [auth?.token, pathname, router]);

	useEffect(() => {
		if (auth == null) return;
		if (auth?.token == null && (pathname === "/account" || pathname === "/create")) {
			router.push("/auth");
		}
	}, [auth?.token, pathname, router]);

	return (
		<header className="bg-white border-b p-4 flex items-center justify-between md:justify-start md:gap-8">
			{/* Logo */}
			<div
				className="flex items-center gap-2 pl-2 cursor-pointer"
				onClick={() => router.push("/")}
			>
				<SparklesIcon className="w-5 h-5 text-primary"/>
				<span className="text-xl font-bold">svgen.io</span>
			</div>

			{/* Desktop Nav */}
			<nav className="hidden md:flex gap-2 ml-auto pr-4">
				{navItems.filter((v) => {
					if (v.label == "Sign In") return auth?.token == null;
					if (v.label == "Account") return auth?.token != null;
					return true;
				}).map(({label, href}) => (
					<Link key={href} href={href} passHref>
						<Button
							variant={pathname === href ? "default" : "ghost"}
							className="cursor-pointer"
						>
							{label}
						</Button>
					</Link>
				))}
			</nav>

			{/* Mobile Menu Button */}
			<button
				className="md:hidden p-2 ml-auto"
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{mobileMenuOpen ? <XIcon className="w-5 h-5"/> : <MenuIcon className="w-5 h-5"/>}
			</button>

			{/* Mobile Nav */}
			{mobileMenuOpen && (
				<div className="absolute top-16 left-0 w-full bg-white border-t shadow-md flex flex-col z-50 md:hidden">
					{navItems.map(({label, href}) => (
						<Link key={href} href={href} passHref>
							<Button
								variant={pathname === href ? "default" : "ghost"}
								className="w-full justify-start"
								onClick={() => setMobileMenuOpen(false)}
							>
								{label}
							</Button>
						</Link>
					))}
				</div>
			)}
		</header>
	);
}
