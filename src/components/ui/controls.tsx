"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Settings2, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SvgGrid from "@/components/SvgGrid";
import type { components } from "@/types/api-types";
import { optimize } from "svgo/browser";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";


// Presets, styles, quantities
const styles = [
	"vector_illustration", "vector_illustration/cartoon", "vector_illustration/doodle_line_art",
	/* ...other styles... */ "icon/outline", "icon/outline_gradient"
];
const quantities = [1, 2, 3, 5, 7, 10];

// Types
type SVGGenerationRequest = components["schemas"]["SVGGenerationRequest"];
type Result = { svg: string; prompt: string };

interface ControlsProps {
	onGenerate: (results: Result[]) => void;
	setLoading: (v: boolean) => void;
	loading: boolean;
}

export function Controls({ onGenerate, setLoading, loading }: ControlsProps) {
	const [prompt, setPrompt] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [style, setStyle] = useState(styles[0]);
	const [optimizeSvg, setOptimizeSvg] = useState(false);

	const fetchOneSvg = async (pr: string): Promise<string> => {
		const payload: SVGGenerationRequest = { prompt: pr, size: "1024x1024", style, aspect_ratio: "Not set", quantity: 1 } as any;
		const res = await fetch("https://svgen-backend-production.up.railway.app/v1/svg", {
			method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
		});
		const json = await res.json();
		let rawSvg = Array.isArray(json.svg) ? json.svg[0] : json.svg;
		if (optimizeSvg) {
			try { rawSvg = optimize(rawSvg as string, { multipass: true }).data; } catch {}
		}
		return rawSvg as string;
	};

	const handleSend = async () => {
		if (!prompt.trim()) return;
		setLoading(true);
		onGenerate([]); // placeholders if desired
		try {
			const svgs = await Promise.all(Array.from({ length: quantity }, () =>
				fetchOneSvg(prompt).catch(() => `<svg><text>Error</text></svg>`)
			));
			onGenerate(svgs.map(svg => ({ svg, prompt })));
		} catch {
			onGenerate(Array.from({ length: quantity }, () => ({ svg: `<svg><text>Error</text></svg>`, prompt })));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-wrap items-start gap-4">
			<div className="relative flex-1">
				{/* Settings Popover */}
				<Popover>
					<PopoverTrigger asChild>
						<Button size="icon" variant="ghost" className="p-0" aria-label="Settings">
							<Settings2 />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-48">
						<label className="flex items-center justify-between">
							<span>Optimize SVG</span>
							<input type="checkbox" checked={optimizeSvg} onChange={e => setOptimizeSvg(e.target.checked)} />
						</label>
						<label>
							Quantity
							<select value={quantity} onChange={e => setQuantity(+e.target.value)}>
								{quantities.map(q => <option key={q} value={q}>{q}</option>)}
							</select>
						</label>
						<label>
							Style
							<select value={style} onChange={e => setStyle(e.target.value)}>
								{styles.map(s => <option key={s} value={s}>{s}</option>)}
							</select>
						</label>
					</PopoverContent>
				</Popover>

				{/* Text Input and Send Buttons */}
				<Textarea
					placeholder="Enter your instructions"
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
				/>
				<Button size="icon" onClick={handleSend} aria-label="Send"><ArrowUp /></Button>
				<Button size="icon" onClick={handleSend} aria-label="Attach"><Wand2 /></Button>
			</div>
		</div>
	);
}