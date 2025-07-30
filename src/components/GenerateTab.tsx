"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {ArrowUp, Paperclip, Settings, Settings2} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SvgGrid from "@/components/SvgGrid";
import type { components } from "@/types/api-types";
// Import SVGO optimize from browser build to avoid fs dependency
import { optimize } from "svgo/browser";
import {PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import {Popover} from "@/components/ui/popover";


// Preset prompts, styles, and quantity options
const presets = ["App Logo", "Search Icon", "SVG Image", "Improve Icon"];
const styles = [
	"vector_illustration",
	"vector_illustration/cartoon",
	"vector_illustration/doodle_line_art",
	"vector_illustration/engraving",
	"vector_illustration/flat_2",
	"vector_illustration/kawaii",
	"vector_illustration/line_art",
	"vector_illustration/line_circuit",
	"vector_illustration/linocut",
	"vector_illustration/seamless",
	"icon",
	"icon/broken_line",
	"icon/colored_outline",
	"icon/colored_shapes",
	"icon/colored_shapes_gradient",
	"icon/doodle_fill",
	"icon/doodle_offset_fill",
	"icon/offset_fill",
	"icon/outline",
	"icon/outline_gradient",
	"icon/uneven_fill",
];
const quantities = [1, 2, 3, 5, 7, 10];

type SVGGenerationRequest = components["schemas"]["SVGGenerationRequest"];
type Result = { svg: string; prompt: string };

export default function GenerateTab() {
	const [newMessage, setNewMessage] = useState("");
	const [quantity, setQuantity] = useState<number>(1);
	const [style, setStyle] = useState<string>("icon/outline");
	const [optimizeSvg, setOptimizeSvg] = useState<boolean>(false);
	const [svgResults, setSvgResults] = useState<Result[]>([]);
	const [loading, setLoading] = useState(false);

	// helper that returns one SVG string (or throws)
	const fetchOneSvg = async (prompt: string): Promise<string> => {
		const payload: SVGGenerationRequest = {
			prompt,
			size: "1024x1024",
			style,
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
		const rawSvg = Array.isArray(json.svg) ? json.svg[0] : json.svg;

		// optimize if enabled
		if (optimizeSvg) {
			try {
				const optimized = optimize(rawSvg as string, { multipass: true });
				return optimized.data;
			} catch {
				return rawSvg as string;
			}
		}

		return rawSvg as string;
	};

	const handleSend = async () => {
		const prompt = newMessage.trim();
		if (!prompt) return;

		setLoading(true);
		setNewMessage("");

		// pre-fill placeholders so grid keeps layout
		const placeholders: Result[] = Array.from({ length: quantity }, () => ({ svg: "", prompt }));
		setSvgResults(placeholders);

		try {
			const svgs = await Promise.all(
				Array.from({ length: quantity }, () =>
					fetchOneSvg(prompt).catch(() =>
						`<svg xmlns=\"http://www.w3.org/2000/svg\"><text x=\"0\" y=\"15\">Error</text></svg>`
					)
				)
			);
			setSvgResults(svgs.map((svg) => ({ svg, prompt })));
		} catch {
			setSvgResults(
				Array.from({ length: quantity }, () => ({
					svg: `<svg xmlns=\"http://www.w3.org/2000/svg\"><text x=\"0\" y=\"15\">Error</text></svg>`,
					prompt,
				}))
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-6">
			{/* Controls */}
			<div className="flex flex-wrap items-start gap-4">
				<div className="relative flex-1">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								onClick={handleSend}
								size="icon"
								variant="ghost"
								className="absolute bottom-2 left-2 h-8 w-8 p-0 rounded-full"
								aria-label="Settings"
							>
								<Settings2 className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-48 bg-white border-1 border-gray-200 rounded-lg p-2 shadow-md z-[1000]">
							<div className="space-y-4">
								{/* Optimize checkbox */}
								<label className="flex items-center justify-between text-sm">
									<span>Optimize SVG</span>
									<input
										type="checkbox"
										checked={optimizeSvg}
										onChange={(e) => setOptimizeSvg(e.target.checked)}
										className="h-4 w-4 accent-blue-500"
									/>
								</label>

								{/* Quantity selector */}
								<div className="flex items-center justify-between">
									<label htmlFor="quantity" className="text-sm">
										Quantity
									</label>
									<select
										id="quantity"
										value={quantity}
										onChange={(e) => setQuantity(Number(e.target.value))}
										className="h-8 w-16 rounded-md border border-gray-300 px-2 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
										{quantities.map((q) => (
											<option key={q} value={q}>
												{q}
											</option>
										))}
									</select>
								</div>

								{/* Style selector */}
								<div className="flex items-center justify-between">
									<select
										id="style"
										value={style}
										onChange={(e) => setStyle(e.target.value)}
										className="h-8 w-full rounded-md border border-gray-300 px-2 text-left text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
										{styles.map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</select>
								</div>
							</div>
						</PopoverContent>
					</Popover>

					{/* Attach Button */}
					<Button
						onClick={handleSend}
						size="icon"
						variant="ghost"
						className="absolute bottom-2 right-12 rounded-full h-8 w-8 p-0"
						aria-label="Attach"
					>
						<Paperclip className="h-4 w-4" />
					</Button>

					{/* Textarea Input */}
					<Textarea
						placeholder="Enter your instructions"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						className="bg-gray-100 shadow-none w-full pr-10 pt-5 px-4 pb-12 rounded-2xl focus:outline-none focus-visible:ring-0 max-h-80 resize-none"
					/>

					{/* Send Button */}
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
					<Badge key={i} variant="outline" className="cursor-pointer text-sm px-2 py-1 rounded-2xl" onClick={() => setNewMessage(p)}>{p}</Badge>
				))}
			</div>

			{/* SVG Results Grid */}
			<SvgGrid svgResults={svgResults} loading={loading} />
		</div>
	);
}
