"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SvgGrid from "@/components/SvgGrid";
import type { components } from "@/types/api-types";

const presets    = ["App Logo", "Search Icon", "SVG Image", "Improve Icon"];
const quantities = [1, 2, 3, 5, 7, 10];

type SVGGenerationRequest = components["schemas"]["SVGGenerationRequest"];
type Result = { svg: string; prompt: string };

export default function GenerateTab() {
	const [newMessage, setNewMessage] = useState("");
	const [quantity,   setQuantity]   = useState<number>(1);
	const [svgResults, setSvgResults] = useState<Result[]>([]);
	const [loading,    setLoading]    = useState(false);

	// helper that returns one SVG string (or throws)
	const fetchOneSvg = async (prompt: string): Promise<string> => {
		const payload: SVGGenerationRequest = {
			prompt,
			size: "1024x1024",
			style: "vector_illustration",
			aspect_ratio: "Not set",
			quantity: 1,
		} as any;

		const res = await fetch(
			"https://svgen-backend-production.up.railway.app/v1/svg",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			}
		);
		if (!res.ok) {
			const txt = await res.text().catch(() => "<unable to read>");
			throw new Error(`HTTP ${res.status}: ${txt}`);
		}
		const json = await res.json();
		const svg = Array.isArray(json.svg) ? json.svg[0] : json.svg;
		return svg as string;
	};

	const handleSend = async () => {
		const prompt = newMessage.trim();
		if (!prompt) return;

		setLoading(true);
		setNewMessage("");

		// pre-fill placeholders so grid keeps layout
		const placeholders: Result[] = Array.from({ length: quantity }, () => ({
			svg: "",
			prompt
		}));
		setSvgResults(placeholders);

		try {
			const svgs = await Promise.all(
				Array.from({ length: quantity }, () =>
					fetchOneSvg(prompt).catch(() =>
						`<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15">Error</text></svg>`
					)
				)
			);

			// map each returned SVG to its prompt
			const results: Result[] = svgs.map((svg) => ({ svg, prompt }));
			setSvgResults(results);
		} catch {
			// fallback: all error placeholders
			setSvgResults(
				Array.from({ length: quantity }, () => ({
					svg: `<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15">Error</text></svg>`,
					prompt
				}))
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-6">
			{/* Controls */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="relative flex-1">
					<select
						id="quantity"
						value={quantity}
						onChange={(e) => setQuantity(Number(e.target.value))}
						className="rounded-lg border px-2 py-1 border-none focus:outline-none focus:ring-0 absolute bottom-2 right-22"
					>
						{quantities.map((q) => (
							<option key={q} value={q}>
								{q}
							</option>
						))}
					</select>

					<Button
						onClick={handleSend}
						size="icon"
						variant="ghost"
						className="absolute bottom-2 right-12 rounded-full h-8 w-8 p-0"
						aria-label="Attach"
					>
						<Paperclip className="h-4 w-4" />
					</Button>

					<Textarea
						placeholder="Enter your instructions"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						className="bg-gray-100 shadow-none w-full pr-10 pt-5 px-4 pb-4 rounded-2xl focus:outline-none focus-visible:ring-0 max-h-80 resize-none"
					/>

					<Button
						onClick={handleSend}
						size="icon"
						className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0"
						aria-label="Send"
					>
						<ArrowUp className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Presets */}
			<div className="flex flex-wrap justify-center gap-3">
				{presets.map((p, i) => (
					<Badge
						key={i}
						variant="outline"
						className="cursor-pointer text-sm px-2 py-1 rounded-2xl"
						onClick={() => setNewMessage(p)}
					>
						{p}
					</Badge>
				))}
			</div>

			{/* SVG Results Grid */}
			<SvgGrid svgResults={svgResults} loading={loading} />
		</div>
	);
}
