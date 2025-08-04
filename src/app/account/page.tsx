"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import type { components } from "@/types/api-types";
import {router} from "next/client";

// Schemas for clarity
type UserWithRelations = components["schemas"]["UserWithRelations"];
type UserStatistics = components["schemas"]["UserStatistics"];

export default function AccountPage() {
	const { auth, logout } = useAuth();
	const [user, setUser] = useState<UserWithRelations | null>(null);
	const [stats, setStats] = useState<UserStatistics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	function performLogout() {
		logout();
	}

	useEffect(() => {
		if (!auth) return;

		if (!auth?.token) {
			setError("Not authenticated");
			setLoading(false);
			router.push("/login").then();
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
	}, [auth]);

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

	const {
		username,
		email,
		generation_limit,
		private_limit,
		created_at,
		subscription,
	} = user;

	// percentages of limits used
	const genPct = Math.min(
		100,
		Math.round((stats.total_generations / generation_limit) * 100)
	);
	const privPct = Math.min(
		100,
		Math.round((stats.private_svgs / private_limit) * 100)
	);

	return (
		<div className="max-w-md mx-auto pt-16 space-y-6">
			<h1 className="text-2xl font-semibold">Account Details</h1>

			<div>
				<Label>Username</Label>
				<p>{username}</p>
			</div>

			<div>
				<Label>Email</Label>
				<p>{email}</p>
			</div>

			{/* Generation Limit with Progress Bar */}
			<div>
				<div className="flex justify-between mb-1">
					<Label>Generation Limit</Label>
					<span>
            {stats.total_generations} / {generation_limit} ({genPct}%)
          </span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
					<div
						className="h-2 rounded-full"
						style={{ width: `${genPct}%`, backgroundColor: "#3B82F6" }}
					/>
				</div>
			</div>

			{/* Private Limit with Progress Bar */}
			<div>
				<div className="flex justify-between mb-1">
					<Label>Private Limit</Label>
					<span>
            {stats.private_svgs} / {private_limit} ({privPct}%)
          </span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
					<div
						className="h-2 rounded-full"
						style={{ width: `${privPct}%`, backgroundColor: "#10B981" }}
					/>
				</div>
			</div>

			<div>
				<Label>Account Created</Label>
				<p>{new Date(created_at).toLocaleDateString()}</p>
			</div>

			{subscription && (
				<div className="pt-4 border-t">
					<h2 className="text-xl font-medium">Subscription</h2>
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
			)}

			{/* Usage Statistics remains unchanged */}
			<div className="pt-4 border-t space-y-2">
				<h2 className="text-xl font-medium">Usage Statistics</h2>
				<div>
					<Label>Total Generations</Label>
					<p>{stats.total_generations}</p>
				</div>
				<div>
					<Label>Total SVGs</Label>
					<p>{stats.total_svgs}</p>
				</div>
				<div>
					<Label>Public SVGs</Label>
					<p>{stats.public_svgs}</p>
				</div>
				<div>
					<Label>Private SVGs</Label>
					<p>{stats.private_svgs}</p>
				</div>
			</div>

			<button
				onClick={performLogout}
				className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
			>
				Log Out
			</button>
		</div>
	);
}
