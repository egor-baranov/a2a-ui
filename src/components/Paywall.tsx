"use client";

import React, {useEffect, useState} from "react";
import {CardElement, Elements, PaymentRequestButtonElement, useStripe} from "@stripe/react-stripe-js";
import {loadStripe, Stripe, PaymentRequest} from "@stripe/stripe-js";
import {Switch} from "@/components/ui/switch"
import {TiltEffect} from "@/utils/TiltEffect";
import BillingToggle from "@/components/ui/billing-toggle";
import {useRouter} from "next/navigation";

type Tier = {
	id: string;
	name: string;
	price: number;
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
		name: "Basic",
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
		name: "Pro",
		price: 30,
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

// Replace with your real publishable key
const stripePromise = loadStripe("pk_test_51RowYbPubqePCQoUUq1HwYfxtfCjTo0XeElMC6ZjwmtFJnrLmIgVVXTDpRKAiFbnvbpuj9dBq6zHPaFQJdVgktWd00SaBLGDeu");

// Component to render Apple Pay / Google Pay button
const PaymentRequestButton: React.FC = () => {
	const stripe = useStripe() as Stripe | null;
	const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

	useEffect(() => {
		if (!stripe) return;

		const pr = stripe.paymentRequest({
			country: "US",
			currency: "usd",
			total: {label: "Demo Purchase", amount: 1000},
			requestPayerName: true,
			requestPayerEmail: true,
		});

		// Only show the button if the user can pay
		pr.canMakePayment().then((result) => {
			if (result && (result.applePay || result.googlePay)) {
				setPaymentRequest(pr);
			}
		});

		// Optionally handle paymentmethod event (demo only)
		pr.on("paymentmethod", (ev) => {
			console.log("Selected payment method:", ev.paymentMethod.type);
			// ev.complete('success');
		});
	}, [stripe]);

	if (!paymentRequest) return null;

	return (
		<PaymentRequestButtonElement
			options={{paymentRequest}}
			className="stripe-payment-request-button mb-4"
		/>
	);
};


export default function Paywall() {
	const [selectedTier, setSelectedTier] = useState<string>("free");
	const [loading, setLoading] = useState(false);
	const [isAnnual, setIsAnnual] = React.useState(false);
	const router = useRouter();

	const handleSubscribe = (tierId: string) => {
		if (tierId === selectedTier) return;
		setLoading(true);

		// Simulate async subscription process
		setTimeout(() => {
			if (tierId == "basic") {
				router.push("https://buy.stripe.com/test_aFacN5eYg9Nt1OL9medwc01");
			}

			if (tierId == "pro") {
				router.push("https://buy.stripe.com/test_aFaaEX03m8Jpctpbumdwc02");
			}

			// setLoading(false);
			// setSelectedTier(tierId);
		}, 1000);
	};

	return (
		<div className="max-w-7xl mx-auto px-6">
			<div className="flex items-center space-x-4 w-full justify-center pb-4">
				<BillingToggle
					onChange={(mode) => setIsAnnual(mode == "annually")}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{tiers.map(({id, name, description, features, price}) => {
					const isSelected = id === selectedTier;
					return (
						<TiltEffect tilt={1 / 32.0}>
							<div
								key={id}
								className={`border border-1 rounded-lg p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-gray-100
                ${isSelected ? "bg-gradient-to-r from-[#FBDAEC] to-[#F5EDA4] text-black" : "bg-white/20 backdrop-blur text-black"}
              `}
							>
								<div>
									<h3
										className="text-2xl font-bold mb-2">{`${name}` + (name === "Free" ? '' : ` ($${Math.round(price * (isAnnual ? 12 * 0.8 : 1))}/${isAnnual ? "year" : "month"})`)}</h3>
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
										? "bg-gray-400 cursor-default text-black"
										: "bg-gray-50 border-1 hover:bg-gray-100 text-black"}
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                `}
								>
									{isSelected ? "Current Plan" : loading ? "Processing..." : `Go ${name}`}
								</button>
							</div>
						</TiltEffect>
					);
				})}
			</div>
		</div>
	);
}
