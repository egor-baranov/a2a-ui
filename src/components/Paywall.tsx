"use client";

import React, {useState} from "react";
import {TiltEffect} from "@/utils/TiltEffect";
import BillingToggle from "@/components/ui/billing-toggle";
import {useRouter} from "next/navigation";
import {useAuth} from "@/providers/AuthProvider";

import {
	Check,
	DownloadCloud,
	Star,
	Zap,
	Clock,
	Mail,
	Award,
	Infinity,
	Cpu,
	Settings,
	ShieldCheck,
	Users,
} from "lucide-react";


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
		name: "Base",
		price: 10,
		description: "Advanced features for casual users",
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

// Types
type FeatureItem =
	| string
	| {
	label: string;
	/**
	 * Optional override: a React node to use as the icon for this feature.
	 * If you provide this, it will be rendered directly (use a lucide-react icon component or any JSX).
	 */
	icon?: React.ReactNode;
};

// Auto-select an icon based on keyword heuristics. Feel free to extend this mapping.
function pickIconForFeatureText(featureText: string) {
	const f = featureText.toLowerCase();
	if (f.includes("unlimited") || f.includes("unlimited svg") || f.includes("unlimited svg")) return Infinity;
	if (f.includes("generate") || f.includes("svg")) return Check;
	if (f.includes("resolution") || f.includes("hd") || f.includes("ultra") || f.includes("2048") || f.includes("1024")) return Star;
	if (f.includes("download")) return DownloadCloud;
	if (f.includes("support") || f.includes("priority") || f.includes("dedicated")) return Mail;
	if (f.includes("custom") || f.includes("style") || f.includes("aspect")) return Settings;
	if (f.includes("commercial") || f.includes("license")) return ShieldCheck;
	if (f.includes("early")) return Award;
	if (f.includes("team") || f.includes("teams") || f.includes("users")) return Users;
	if (f.includes("speed") || f.includes("fast") || f.includes("instant")) return Zap;
	if (f.includes("cpu") || f.includes("processing")) return Cpu;
	if (f.includes("daily") || f.includes("per day") || f.includes("5 svg")) return Clock;
	// fallback
	return Check;
}

function FeatureRow({ item }: { item: FeatureItem }) {
	// Normalize to object form so we can support both string features and {label, icon} shapes
	const isString = typeof item === "string";
	const label = isString ? (item as string) : (item as { label: string }).label;
	const overrideIcon = !isString && (item as { icon?: React.ReactNode }).icon;

	if (overrideIcon) {
		return (
			<li className="flex items-center leading-tight">
				<span className="mr-4 flex-shrink-0 flex items-center justify-center h-5">{overrideIcon}</span>
				<span className="text-sm leading-tight flex items-center h-5">{label}</span>
			</li>
		);
	}

	const IconComp = pickIconForFeatureText(label);

	return (
		<li className="flex items-center leading-tight">
			<span className="flex items-center justify-center h-5 mr-3 flex-shrink-0">
				<IconComp className="w-5 h-5" aria-hidden />
			</span>
			<span className="text-sm leading-tight flex items-center h-5">{label}</span>
		</li>
	);
}

export default function Paywall() {
	const [selectedTier, setSelectedTier] = useState<string>("free");
	const [loading, setLoading] = useState(false);
	const [isAnnual, setIsAnnual] = React.useState(false);
	const router = useRouter();
	const {auth, logout} = useAuth();


	const handleSubscribe = (tierId: string) => {
		if (tierId === selectedTier) return;
		setLoading(true);

		// Simulate async subscription process
		setTimeout(() => {
			if (auth?.token == null) {
				router.push("/auth");
				return;
			}

			if (tierId == "basic") {
				router.push("https://buy.stripe.com/test_aFacN5eYg9Nt1OL9medwc01");
			}

			if (tierId == "pro") {
				router.push("https://buy.stripe.com/test_aFaaEX03m8Jpctpbumdwc02");
			}
		}, 1000);
	};

	return (
		<div className="max-w-full mx-auto px-6">
			<div className="flex items-center space-x-4 w-full justify-center pb-4">
				<BillingToggle
					onChange={(mode) => setIsAnnual(mode == "annually")}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{tiers.map(({id, name, description, features, price}) => {
					const isSelected = id === selectedTier;
					return (
						<TiltEffect key={id} tilt={1 / 32.0}>
							<div
								className={`border rounded-3xl px-2 pb-2 flex flex-col justify-between hover:shadow-xl hover:shadow-gray-100
                ${isSelected ? "bg-gradient-to-r from-[#FBDAEC] to-[#F5EDA4] text-black" : "bg-white/20 backdrop-blur text-black"}
              `}
							>
								{id != "free" && isAnnual &&
                    <div
                        className="absolute top-3 right-3 bg-gradient-to-r from-[#FBDAEC] to-[#F5EDA4] text-black rounded-xl p-2 font-medium text-md">
											{id == "basic" ? "-17%" : "-30%"}
                    </div>
								}
								<div className={"pt-6 px-4 pb-4"}>
									<h3 className="text-2xl font-medium mb-0">
										{name}
									</h3>
									{id != "free" && <div className="flex flex-row items-start">
                      <h5 className="text-2xl font-medium my-4 mt-6">
                          $
                      </h5>
                      <h3 className="text-4xl font-medium my-2 mt-6">
												{(name === "Free" ? "" : `${id == "basic" ? (isAnnual ? 100 : 10) : (isAnnual ? 250 : 30)}`)}
                      </h3>
                      <div className="flex flex-col text-lg font-medium my-4 mt-6 ml-2 text-gray-600">
                          <div className="text-sm">{isAnnual ? "USD/" : "USD/"}</div>
                          <div className="text-sm">{isAnnual ? "year" : "month"}</div>
                      </div>
                  </div>}

									<p className="mb-4 text-sm font-medium">{description}</p>

									<button
										disabled={loading || isSelected}
										onClick={() => handleSubscribe(id)}
										className={`mt-auto py-3 rounded-full font-semibold w-full
                  ${isSelected
											? "bg-gray-400 cursor-default text-black"
											: "bg-black border-1 hover:bg-gray-900 text-white"}
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                `}
									>
										{isSelected ? "Current Plan" : loading ? "Processing..." : `Get ${name}`}
									</button>

									<ul className="mt-6 space-y-4 list-none list-inside text-sm">
										{features.map((feature, i) => (
											<FeatureRow key={i} item={feature}/>
										))}
									</ul>
								</div>
							</div>
						</TiltEffect>
					);
				})}
			</div>
		</div>
	);
}
