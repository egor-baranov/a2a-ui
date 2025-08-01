"use client";

import React, {useEffect, useState} from "react";
import {CardElement, Elements, PaymentRequestButtonElement, useStripe} from "@stripe/react-stripe-js";
import {loadStripe, Stripe, PaymentRequest} from "@stripe/stripe-js";
import {Switch} from "@/components/ui/switch"

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
		name: "Pro ($30/mo)",
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

			<div className="flex items-center space-x-4 w-full justify-center pb-4">
				<span className={!isAnnual ? "font-semibold text-primary text-xl" : "font-semibold text-muted-foreground text-xl"}>
					Monthly
				</span>
				<Switch
					checked={isAnnual}
					onCheckedChange={setIsAnnual}
					id="billing-toggle"
					className="scale-120 cursor-pointer"
				/>
				<span className={isAnnual ? "font-semibold text-primary text-xl" : "font-semibold text-muted-foreground text-xl"}>
					Annually
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{tiers.map(({id, name, description, features}) => {
					const isSelected = id === selectedTier;
					return (
						<div
							key={id}
							className={`border border-1 rounded-lg p-8 flex flex-col justify-between
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
									: "bg-gray-50 border-1 hover:bg-gray-100 text-black"}
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                `}
							>
								{isSelected ? "Current Plan" : loading ? "Processing..." : "Subscribe"}
							</button>
						</div>
					);
				})}

				<Elements stripe={stripePromise}>
					<div>
						<h2 className="text-xl font-semibold mb-4">Payment</h2>

						<div className="p-4 border rounded mb-4">
							<label className="block text-sm font-medium mb-2">Card Details</label>
							<CardElement/>
						</div>

						<div className="p-4 border rounded">
							<label className="block text-sm font-medium mb-2">Apple/Google Pay</label>
							<PaymentRequestButton/>
						</div>
					</div>
				</Elements>
			</div>
		</div>
	);
}
