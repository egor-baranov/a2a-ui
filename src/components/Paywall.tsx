"use client";

import React, { useState } from "react";

type Tier = {
	id: string;
	name: string;
	price: number; // 0 means free
	description: string;
	features: string[];
};

const tiers: Tier[] = [
	{
		id: "free",
		name: "Free",
		price: 0,
		description: "Basic access to AI SVG generation",
		features: [
			"Generate up to 5 SVGs per day",
			"Standard resolution (512x512)",
			"Basic icon styles",
			"Community support",
		],
	},
	{
		id: "basic",
		name: "Basic ($10/mo)",
		price: 10,
		description: "Enhanced features for casual users",
		features: [
			"Generate up to 50 SVGs per day",
			"High resolution (1024x1024)",
			"Access to premium icon styles",
			"Priority email support",
			"Download in multiple formats",
		],
	},
	{
		id: "pro",
		name: "Pro ($20/mo)",
		price: 20,
		description: "Full access for professionals and teams",
		features: [
			"Unlimited SVG generation",
			"Ultra HD resolution (2048x2048)",
			"Custom style and aspect ratio",
			"Dedicated support",
			"Commercial usage license",
			"Early access to new features",
		],
	},
];

export default function Paywall() {
	const [selectedTier, setSelectedTier] = useState<string>("free");
	const [loading, setLoading] = useState(false);

	const handleSubscribe = (tierId: string) => {
		if (tierId === selectedTier) return;
		setLoading(true);

		// Simulate async subscription process
		setTimeout(() => {
			setSelectedTier(tierId);
			setLoading(false);
			alert(`Subscribed to ${tierId} plan!`);
		}, 1000);
	};

	return (
		<div className="max-w-7xl mx-auto px-6 py-12">
			<h2 className="text-3xl font-extrabold text-center text-black mb-10">
				Choose Your Plan
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{tiers.map(({ id, name, description, features }) => {
					const isSelected = id === selectedTier;
					return (
						<div
							key={id}
							className={`border border-black rounded-lg p-8 flex flex-col justify-between
                ${isSelected ? "bg-black text-white" : "bg-white text-black"}
              `}
						>
							<div>
								<h3 className="text-2xl font-bold mb-2">{name}</h3>
								<p className="mb-6 text-sm font-medium">{description}</p>
								<ul className="mb-6 space-y-2 list-disc list-inside text-sm">
									{features.map((feature, i) => (
										<li key={i}>{feature}</li>
									))}
								</ul>
							</div>
							<button
								disabled={loading || isSelected}
								onClick={() => handleSubscribe(id)}
								className={`mt-auto py-3 rounded-md font-semibold w-full
                  ${isSelected
									? "bg-gray-700 cursor-default text-white"
									: "bg-black hover:bg-gray-900 text-white"}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
							>
								{isSelected ? "Current Plan" : loading ? "Processing..." : "Subscribe"}
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}
