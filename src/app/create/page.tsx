"use client";

import React, {useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
	ArrowLeft,
	ArrowUp,
	Copy,
	Download,
	Edit,
	ExternalLink,
	Paperclip,
	Settings,
	Settings2,
	Wand2
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import SvgGrid from "@/components/SvgGrid";
import type {components} from "@/types/api-types";
// Import SVGO optimize from browser build to avoid fs dependency
import {optimize} from "svgo/browser";
import {PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {Popover} from "@/components/ui/popover";


// Preset prompts, styles, and quantity options
const presets = ["App Logo", "Search Icon", "SVG Image"];
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
type PromptEnhanceRequest = components["schemas"]["PromptEnhanceRequest"];
type Result = { svgs: string[]; prompt: string };

export default function CreatePage() {
	const [newMessage, setNewMessage] = useState("");
	const [quantity, setQuantity] = useState<number>(1);
	const [style, setStyle] = useState<string>("icon/outline");
	const [optimizeSvg, setOptimizeSvg] = useState<boolean>(false);
	const [svgResults, setSvgResults] = useState<Result[]>([]);
	const [loading, setLoading] = useState(false);
	const [previewResult, setPreviewResult] = useState<{ svg: string; prompt: string } | null>(null);

	// enhance prompt helper
	const handleEnhance = async () => {
		const prompt = newMessage.trim();
		if (!prompt) return;
		try {
			const enhancePayload: PromptEnhanceRequest = {
				prompt,
				style: style.startsWith("icon") ? "icon" : "vector_illustration",
			};

			setNewMessage("Enhancing prompt...");
			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/v1/enhance-prompt",
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(enhancePayload),
				}
			);
			if (!res.ok) throw new Error("Enhance request failed");

			const {enhanced_prompt} = (await res.json()) as components["schemas"]["PromptEnhanceResponse"];

			// Remove wrapping quotes if present
			const cleanPrompt = enhanced_prompt.replace(/^"(.*)"$/, "$1");
			setNewMessage(cleanPrompt);
		} catch (e) {
			console.error("Prompt enhancement failed", e);
		}
	};

	const handleSvgSelect = (item: { svg: string; prompt: string }) => {
		console.log("User clicked SVG from prompt:", item.prompt);
		console.log("SVG content is:", item.svg);
		// e.g. open in an editor, show details panel, etc.
		setPreviewResult(item);
	};

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
				headers: {"Content-Type": "application/json"},
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
				const optimized = optimize(rawSvg as string, {multipass: true});
				return optimized.data;
			} catch {
				return rawSvg as string;
			}
		}

		return rawSvg as string;
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const handleSend = async () => {
		const prompt = newMessage.trim();
		if (!prompt) return;

		setLoading(true);
		setNewMessage("");

		// create a placeholder Result for this batch
		setSvgResults(current => [
			...current,
			{prompt, svgs: Array(quantity).fill("")}
		]);

		try {
			const svgs = await Promise.all(
				Array.from({length: quantity}, () =>
					fetchOneSvg(prompt).catch(() =>
						`<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15">Error</text></svg>`
					)
				)
			);

			// replace the last placeholder with the real svgs
			setSvgResults(current => {
				const newResults = [...current];
				newResults[newResults.length - 1] = {prompt, svgs};
				return newResults;
			});
		} catch {
			// on error, fill with error svgs
			setSvgResults(current => {
				const newResults = [...current];
				newResults[newResults.length - 1] = {
					prompt,
					svgs: Array(quantity).fill(
						`<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15">Error</text></svg>`
					),
				};
				return newResults;
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto px-4">
			{previewResult === null &&
				(<div className="w-full max-w-5xl space-y-4 pt-16">
					{/* Controls */}
					<div className="flex flex-wrap items-start gap-2">
						<div className="relative flex-1">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										size="icon"
										variant="ghost"
										className="absolute bottom-2 left-2 h-8 w-8 p-0 rounded-full"
										aria-label="Settings"
									>
										<Settings2 className="h-4 w-4"/>
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
								onClick={handleEnhance}
								size="icon"
								variant="ghost"
								className="absolute bottom-2 right-12 rounded-full h-8 w-8 p-0"
								aria-label="Enhance Prompt"
							>
								<Wand2 className="h-4 w-4"/>
							</Button>

							{/* Textarea Input */}
							<Textarea
								placeholder="Enter your instructions"
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								className="bg-gray-100 shadow-none w-full pr-10 pt-4 px-4 pb-12 rounded-2xl focus:outline-none focus-visible:ring-0 max-h-80 resize-none"
							/>

							{/* Send Button */}
							<Button
								onClick={handleSend}
								size="icon"
								className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0"
								aria-label="Send"
							>
								<ArrowUp className="h-4 w-4"/>
							</Button>
						</div>
					</div>

					{/* Presets */}
					<div className="flex flex-wrap justify-center gap-3">
						{presets.map((p, i) => (
							<Badge key={i} variant="outline" className="cursor-pointer text-sm px-2 py-1 rounded-2xl"
										 onClick={() => setNewMessage(p)}>{p}</Badge>
						))}
					</div>

					<div className={"pt-4"}/>

					{/* SVG Results Grid */}
					<SvgGrid svgResults={svgResults} loading={loading} onSelect={handleSvgSelect}/>
				</div>)
			}

			{
				previewResult != null && (<div className="w-full max-w-5xl space-y-2 flex flex-col pt-8">

					<div className="flex flex-wrap items-start gap-4">
						<Button
							onClick={() => {
								setPreviewResult(null);
							}}
							size="icon"
							variant="ghost"
							className="h-8 w-8 p-0 rounded-md cursor-pointer"
							aria-label="Settings"
						>
							<ArrowLeft className="h-4 w-4"/>
						</Button>
					</div>

					<div className="flex items-start justify-start space-x-2 mb-4 px-8">
						<h3 className="text-lg font-semibold">{previewResult.prompt}</h3>
						<button
							onClick={() => copyToClipboard(previewResult.prompt)}
							aria-label="Copy Prompt"
							className="p-1 hover:bg-gray-200 rounded cursor-pointer"
						>
							<Copy className="w-4 h-4 text-gray-500" />
						</button>
					</div>

					<div className="flex flex-row w-min items-start justify-start space-x-4 px-8">
						<Button
							variant="outline"
							className="gap-2 cursor-pointer"
							onClick={() => navigator.clipboard.writeText(previewResult?.svg)}
						>
							<Copy className="w-4 h-4" />
							Copy
						</Button>

						<Button
							variant="outline"
							className="gap-2 cursor-pointer"
							onClick={() => {
								const blob = new Blob([previewResult?.svg], { type: "image/svg+xml" });
								const url = URL.createObjectURL(blob);
								window.open(url, "_blank");
							}}						>
							<ExternalLink className="w-4 h-4" />
							Open
						</Button>

						<Button
							variant="outline"
							className="gap-2 cursor-pointer"
							onClick={() => {
								const blob = new Blob([previewResult?.svg], { type: "image/svg+xml" });
								const link = document.createElement("a");
								link.href = URL.createObjectURL(blob);
								link.download = "icon.svg";
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
							}}
						>
							<Download className="w-4 h-4" />
							Download
						</Button>
					</div>

					<div className={"flex flex-col items-center justify-center px-8"}>
						<object
							type="image/svg+xml"
							data={`data:image/svg+xml;utf8,${encodeURIComponent(previewResult.svg)}`}
							className="max-w-full max-h-full flex-grow pointer-events-none"
						/>
					</div>
				</div>)
			}
		</div>
	);
}
