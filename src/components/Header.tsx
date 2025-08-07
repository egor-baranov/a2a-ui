"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {SparklesIcon, MenuIcon, XIcon} from "lucide-react";
import {useAuth} from "@/providers/AuthProvider";
import {cn} from "@/lib/utils";
import {XMarkIcon} from "@heroicons/react/16/solid";

const navItems = [
	{label: "Create", href: "/create"},
	{label: "Explore", href: "/explore"},
	{label: "Pricing", href: "/pricing"},
	{label: "Sign In", href: "/auth"},
	{label: "Account", href: "/account"},
];

function Banner() {
	return (
		<div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
			<div
				aria-hidden="true"
				className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
			>
				<div
					style={{
						clipPath:
							'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
					}}
					className="aspect-577/310 w-144.25 bg-linear-to-r from-[#F788D7] to-[#FAF59F] opacity-30"
				/>
			</div>
			<div
				aria-hidden="true"
				className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
			>
				<div
					style={{
						clipPath:
							'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
					}}
					className="aspect-577/310 w-144.25 bg-linear-to-r from-[#F788D7] to-[#FAF59F] opacity-30"
				/>
			</div>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
				<p className="text-sm/6 text-gray-900">
					<strong className="font-semibold">svgen.io</strong>
					<svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
						<circle r={1} cx={1} cy={1} />
					</svg>
					Explore market-leading logo & icon generation available now.
				</p>
				<a
					href="/create"
					className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
				>
					Try now <span aria-hidden="true">&rarr;</span>
				</a>
			</div>
			<div className="flex flex-1 justify-end">
				<button type="button" className="-m-3 p-3 focus-visible:-outline-offset-4">
					<span className="sr-only">Dismiss</span>
					<XMarkIcon aria-hidden="true" className="size-5 text-gray-900" />
				</button>
			</div>
		</div>
	)
}

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
		<header
			className="
        fixed top-0 left-0 w-full z-50
        bg-white/70 backdrop-blur-md
        border-b
      "
		>

			<Banner/>

			<div className="flex items-center justify-between md:justify-start md:gap-8 p-4">
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
								variant={(pathname === href || label === "Sign In") ? "default" : "ghost"}
								className={cn(
									"cursor-pointer",
									label === "Sign In"
										? "bg-gradient-to-br from-[#FAF59F] to-[#F788D7] text-black font-semibold"
										: ""
								)}
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
			</div>
		</header>
	);
}
