"use client";

import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import type { components } from "@/types/api-types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Paywall from "@/components/Paywall";
import {CardElement, Elements} from "@stripe/react-stripe-js";
import PaymentRequestButton from "@/components/ui/PaymentRequestButton";
import {loadStripe, TokenCreateParams} from "@stripe/stripe-js";
import Account = TokenCreateParams.Account;

import {BarChart3, Gauge, User, Zap} from 'lucide-react';

// Schemas for clarity
type UserWithRelations = components["schemas"]["UserWithRelations"];
type UserStatistics = components["schemas"]["UserStatistics"];

export default function AccountPage() {
	const { auth, logout } = useAuth();
	const router = useRouter();
	const [user, setUser] = useState<UserWithRelations | null>(null);
	const [stats, setStats] = useState<UserStatistics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// UI behavior
	const [activeSection, setActiveSection] = useState<string>("profile");
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

	function performLogout() {
		logout();
		router.push("/auth");
	}

	useEffect(() => {
		if (!auth) return;

		if (!auth?.token) {
			setError("Not authenticated");
			setLoading(false);
			router.push("/auth");
			return;
		}

		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${auth.token}`,
		};

		Promise.all([
			fetch("https://svgen-backend-production.up.railway.app/users/me", { headers }),
			fetch("https://svgen-backend-production.up.railway.app/users/me/statistics", { headers }),
		])
			.then(async ([userRes, statsRes]) => {
				if (!userRes.ok) throw new Error(`User fetch failed: ${await userRes.text()}`);
				if (!statsRes.ok) throw new Error(`Stats fetch failed: ${await statsRes.text()}`);
				setUser((await userRes.json()) as UserWithRelations);
				setStats((await statsRes.json()) as UserStatistics);
			})
			.catch((err: any) => {
				console.error("Data fetch failed", err);
				setError(err.message || "Unknown error");
			})
			.finally(() => setLoading(false));
	}, [auth, router]);

	useEffect(() => {
		// intersection observer to auto-highlight the sidebar entry for the section in view
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.getAttribute("data-section-id");
						if (id) setActiveSection(id);
					}
				});
			},
			{ root: null, threshold: 0.45 }
		);

		Object.values(sectionRefs.current).forEach((el) => {
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, [user, stats]);

	if (loading) {
		return (
			<div className="max-w-md mx-auto pt-16">
				<p>Loading your account...</p>
				<button
					onClick={performLogout}
					className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
				>
					Log Out
				</button>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-md mx-auto pt-16">
				<p className="text-red-500">{error}</p>
				<button
					onClick={performLogout}
					className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
				>
					Log Out
				</button>
			</div>
		);
	}

	if (!user || !stats) return null;

	const { username, email, generation_limit, private_limit, created_at, subscription } = user;

	// percentages of limits used
	const genPct = Math.min(100, Math.round((stats.total_generations / generation_limit) * 100));
	const privPct = Math.min(100, Math.round((stats.private_svgs / private_limit) * 100));

	const stripePromise = loadStripe("pk_test_51RowYbPubqePCQoUUq1HwYfxtfCjTo0XeElMC6ZjwmtFJnrLmIgVVXTDpRKAiFbnvbpuj9dBq6zHPaFQJdVgktWd00SaBLGDeu");

	// build sections dynamically so sidebar can iterate
	const sections = [
		{ id: "profile", title: "Profile", icon: User },
		{ id: "limits", title: "Limits", icon: Gauge },
		{ id: "usage", title: "Usage Statistics", icon: BarChart3 },
		{ id: "actions", title: "Actions", icon: Zap },
	];

	function scrollToSection(id: string) {
		setActiveSection(id);
		const el = sectionRefs.current[id];
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "end" });
			// on mobile, also focus the element for accessibility
			el.setAttribute("tabindex", "-1");
			// small timeout to allow focusing after scroll
			setTimeout(() => el.focus(), 300);
		}
	}

	return (
		<div className="max-w-7xl mx-auto p-6 pt-24">
			{/* Responsive layout: sidebar on top for small screens, left for md+ */}
			<div className="flex flex-col md:flex-row gap-12">
				{/* Sidebar: rounded panel on the left (or on top on mobile) */}
				<aside className="md:w-64 flex-none">
					<nav
						aria-label="Account sections"
						className="rounded-2xl bg-white/20 backdrop-blur p-4 shadow-md ring-1 ring-gray-200"
					>
						<div className="hidden md:block">
							<ul className="space-y-2">
								{sections.map((s) => (
									<li key={s.id}>
										<button
											onClick={() => scrollToSection(s.id)}
											className={`w-full text-left rounded-lg px-3 py-2 transition flex items-start justify-start cursor-pointer ${
												activeSection === s.id
													? "bg-black text-white shadow"
													: "hover:bg-gray-100"
											}`}
											aria-current={activeSection === s.id ? "true" : undefined}
										>
											{s.icon && <s.icon className="w-5 h-5 mr-2" />}
											<span className="font-medium">{s.title}</span>
										</button>
									</li>
								))}
							</ul>
						</div>

						{/* Mobile: horizontal tabs on top. This will naturally be above content because aside is rendered first */}
						<div className="md:hidden">
							<div className="flex gap-2 overflow-x-auto bg-white/20 backdrop-blur py-2 hide-scrollbar flex-col justify-center">
								{sections.map((s) => (
									<button
										key={s.id}
										onClick={() => scrollToSection(s.id)}
										className={`whitespace-nowrap rounded-md mx-1 px-4 py-2 flex items-start text-sm font-medium transition cursor-pointer ${
											activeSection === s.id ? "bg-black text-white" : "bg-white/90 ring-1 ring-gray-200"
										}`}
										aria-current={activeSection === s.id ? "true" : undefined}
									>
										{s.icon && <s.icon className="w-5 h-5 mr-2" />}
										{s.title}
									</button>
								))}
							</div>
						</div>

						<div className="mt-4 text-sm text-gray-600">
							<p className="font-semibold">Signed in as</p>
							<p className="truncate">{email}</p>
						</div>
					</nav>
				</aside>

				{/* Main content */}
				<main className="flex-1 space-y-8">
					{/* Decorative background (kept from original) */}
					<div aria-hidden className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
						<div
							style={{
								clipPath:
									"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
							}}
							className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
						/>
					</div>

					{/* Sections - each section has data-section-id and a ref so we can scroll and observe it */}
					<section
						data-section-id="profile"
						ref={(el) => {
							sectionRefs.current["profile"] = el;
						}}
						className="outline-none"
						tabIndex={-1}
					>
						<h1 className="text-4xl font-medium">Profile</h1>

						<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input id="username" defaultValue={username ?? ""} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" defaultValue={email ?? ""} />
							</div>
						</div>

						<div className="rounded-2xl bg-white/20 backdrop-blur p-4 shadow-sm ring-1 ring-gray-200 mt-4">
							<Label className="text-sm">Subscription</Label>
							<p className="mt-3 text-2xl font-semibold">Base</p>

							<div className="flex flex-row gap-2">
								<Button className="mt-4 cursor-pointer" onClick={() => router.push("/pricing")}>Manage</Button>
								<Button className="mt-4 cursor-pointer border-1" variant="ghost" onClick={() => router.push("/pricing")}>Cancel</Button>
							</div>
						</div>
					</section>

					<section
						data-section-id="limits"
						ref={(el) => {
							sectionRefs.current["limits"] = el;
						}}
						className="pt-6"
						tabIndex={-1}
					>
						<h2 className="text-4xl font-medium">Limits</h2>
						<p className="max-w-md sm:max-w-xl md:max-w-2xl pt-4 text-sm sm:text-lg text-gray-700 mb-6">
							Increase your subscription tier to gain higher generation and private limits.
						</p>

						<div className="mt-4 space-y-4">
							<div>
								<div className="flex justify-between mb-1">
									<Label>Generation Limit</Label>
									<span>
                    {stats.total_generations} / {generation_limit} ({genPct}%)
                  </span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
									<div className="h-2 rounded-full" style={{ width: `${genPct}%`, backgroundColor: "#3B82F6" }} />
								</div>
							</div>

							<div>
								<div className="flex justify-between mb-1">
									<Label>Private Limit</Label>
									<span>
                    {stats.private_svgs} / {private_limit} ({privPct}%)
                  </span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
									<div className="h-2 rounded-full" style={{ width: `${privPct}%`, backgroundColor: "#10B981" }} />
								</div>
							</div>
						</div>
					</section>

					{subscription && (
						<section
							data-section-id="subscription"
							ref={(el) => {
								sectionRefs.current["subscription"] = el;
							}}
							className="pt-6"
							tabIndex={-1}
						>
							<h2 className="text-2xl font-semibold">Subscription</h2>
							<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
								<div>
									<Label>Tier</Label>
									<p>{subscription.tier}</p>
								</div>

								<div>
									<Label>From</Label>
									<p>{new Date(subscription.from_date).toLocaleDateString()}</p>
								</div>

								{subscription.to_date && (
									<div>
										<Label>To</Label>
										<p>{new Date(subscription.to_date).toLocaleDateString()}</p>
									</div>
								)}
							</div>
						</section>
					)}

					<section
						data-section-id="usage"
						ref={(el) => {
							sectionRefs.current["usage"] = el;
						}}
						className="pt-6"
						tabIndex={-1}
					>
						<h2 className="text-4xl font-medium">Usage Statistics</h2>

						<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{/* Total Generations */}
							<div className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-sm ring-1 ring-gray-200">
								<Label className="text-sm">Total Generations</Label>
								<p className="mt-3 text-2xl font-semibold">{stats.total_generations}</p>
								<p className="mt-1 text-xs text-gray-500">
									{genPct}% of {generation_limit} used
								</p>
							</div>

							{/* Total SVGs */}
							<div className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-sm ring-1 ring-gray-200">
								<Label className="text-sm">Total SVGs</Label>
								<p className="mt-3 text-2xl font-semibold">{stats.total_svgs}</p>
								<p className="mt-1 text-xs text-gray-500">
									{stats.public_svgs} public · {stats.private_svgs} private
								</p>
							</div>

							{/* Public SVGs */}
							<div className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-sm ring-1 ring-gray-200">
								<Label className="text-sm">Public SVGs</Label>
								<p className="mt-3 text-2xl font-semibold">{stats.public_svgs}</p>
								<p className="mt-1 text-xs text-gray-500">Available to everyone</p>
							</div>

							{/* Private SVGs */}
							<div className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-sm ring-1 ring-gray-200">
								<Label className="text-sm">Private SVGs</Label>
								<p className="mt-3 text-2xl font-semibold">{stats.private_svgs}</p>
								<p className="mt-1 text-xs text-gray-500">
									{privPct}% of {private_limit} used
								</p>
							</div>
						</div>
					</section>

					<section
						data-section-id="actions"
						ref={(el) => {
							sectionRefs.current["actions"] = el;
						}}
						className="pt-6 pb-12"
						tabIndex={-1}
					>
						<h2 className="text-4xl font-medium">Actions</h2>
						<div className="mt-4 space-y-3 max-w-sm">
							<button
								onClick={performLogout}
								className="w-full py-2 px-4 bg-red-400 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
							>
								Log out
							</button>

							<Button className="w-full py-2 px-4 bg-red-400 text-white rounded-lg hover:bg-red-700 transition cursor-pointer">
								Delete account
							</Button>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
