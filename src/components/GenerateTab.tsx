"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SvgGrid from "@/components/SvgGrid";
import type { components } from "@/types/api-types";

const presets = ["App Logo", "Search Icon", "SVG Image", "Improve Icon"];

type SVGGenerationRequest = components["schemas"]["SVGGenerationRequest"];

export default function GenerateTab() {
	const [newMessage, setNewMessage] = useState("");
	const [svgResults, setSvgResults] = useState<(string | null)[]>([]);
	const [loading, setLoading] = useState(false);

	const handleSend = async () => {
		if (!newMessage.trim()) return;

		setSvgResults((prev) => [...prev, null]); // Add loading placeholder
		setLoading(true);

		const payload: SVGGenerationRequest = {
			prompt: newMessage,
			size: "1024x1024",
			style: "vector_illustration",
			aspect_ratio: "Not set",
		};

		setNewMessage("");

		try {
			const res = await fetch("https://svgen-backend-production.up.railway.app/v1/svg", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errorText = await res.text().catch(() => "<unable to read>");
				throw new Error(`HTTP ${res.status} ${res.statusText}: ${errorText}`);
			}

			const json = await res.json();
			const svg = typeof json.svg === "string" ? json.svg : JSON.stringify(json);

			setSvgResults((prev) => {
				const updated = [...prev];
				const nullIndex = updated.lastIndexOf(null);
				if (nullIndex !== -1) updated[nullIndex] = svg;
				return updated;
			});
		} catch (error: any) {
			console.error("SVG Generation Failed:", error);

			setSvgResults((prev) => {
				const updated = [...prev];
				const nullIndex = updated.lastIndexOf(null);
				if (nullIndex !== -1)
					updated[nullIndex] =
						'<svg height="2500" width="2158" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 950"><path d="..."/></svg>';
				return updated;
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-6">
			{/* Input area */}
			<div className="relative">
				<Button
					onClick={handleSend}
					size="icon"
					variant="ghost"
					className="absolute bottom-2 right-12 rounded-full h-8 w-8 p-0 cursor-pointer bg-none"
					aria-label="Attach"
				>
					<Paperclip className="h-4 w-4" />
				</Button>

				<Textarea
					placeholder="Enter your instructions"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className="bg-gray-100 w-full pr-10 pt-5 px-4 pb-4 rounded-2xl shadow-none focus:outline-none focus-visible:ring-0 min-h-auto overflow-auto max-h-80 resize-none"
				/>
				<Button
					onClick={handleSend}
					size="icon"
					className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 cursor-pointer"
					aria-label="Send"
				>
					<ArrowUp className="h-4 w-4" />
				</Button>
			</div>

			{/* Presets */}
			<div className="flex flex-wrap justify-center gap-3">
				{presets.map((p, i) => (
					<Badge key={i} variant="outline" className="cursor-pointer text-md px-4 py-2 rounded-2xl" onClick={() => setNewMessage(p)}>
						{p}
					</Badge>
				))}
			</div>

			{/* SVG results grid */}
			<SvgGrid svgResults={svgResults} loading={loading} />
		</div>
	);
}
