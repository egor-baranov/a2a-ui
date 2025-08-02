"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import type { components } from "@/types/api-types";

// Schemas for clarity
type UserWithRelations = components["schemas"]["UserWithRelations"];
type SubscriptionResponse = components["schemas"]["SubscriptionResponse"];

export default function AccountPage() {
	const { auth, logout } = useAuth();
	const [user, setUser] = useState<UserWithRelations | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchAccount() {
			console.log("Auth with token:", auth?.token);
			try {
				const res = await fetch(
					"https://svgen-backend-production.up.railway.app/users/me",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${auth?.token}`,
						},
					}
				);
				if (!res.ok) {
					throw new Error(`Fetch failed: ${await res.text()} for token: ${auth?.token}`);
				}
				const data = (await res.json()) as UserWithRelations;
				setUser(data);
			} catch (err: any) {
				console.error("User data fetch failed", err);
				setError(err.message || "Unknown error");
			} finally {
				setLoading(false);
			}
		}

		if (auth?.token) {
			fetchAccount();
		} else {

			setLoading(false);
			setError("Not authenticated");
		}
	}, [auth]);

	if (loading) {
		return (
			<div className="max-w-md mx-auto pt-16">
				<p>Loading your account...</p>

				<button
					onClick={() => logout()}
					type="button"
					className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const { username, email, generation_limit, private_limit, created_at, subscription } = user;

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

			<div>
				<Label>Generation Limit</Label>
				<p>{generation_limit}</p>
			</div>

			<div>
				<Label>Private Limit</Label>
				<p>{private_limit}</p>
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

			<button
				onClick={() => logout()}
				type="button"
				className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
			>
				Log Out
			</button>
		</div>
	);
}
