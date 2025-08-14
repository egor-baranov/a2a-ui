"use client";

import React, {useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {ArrowLeft, ArrowUp, Copy, CopyIcon, Download, ExternalLink, Mic, Settings2, Wand2, XIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import SvgGrid from "@/components/SvgGrid";
import type {components} from "@/types/api-types";
// Import SVGO optimize from browser build to avoid fs dependency
import {optimize} from "svgo/browser";
import {PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {Popover} from "@/components/ui/popover";
import {useAuth} from "@/providers/AuthProvider";
import {useRouter} from "next/navigation";
import {Sidebar, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"


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
type SVGsResponse = components["schemas"]["SVGResponse"][];
type GenerationResponse = components["schemas"]["GenerationResponse"];
type PresetResponse = components["schemas"]["PresetResponse"][];

type Result = { svgs: string[]; prompt: string };

export default function CreatePage() {
	const [newMessage, setNewMessage] = useState("");
	const [quantity, setQuantity] = useState<number>(1);
	const [style, setStyle] = useState<string>("icon/outline");
	const [optimizeSvg, setOptimizeSvg] = useState<boolean>(false);
	const [svgResults, setSvgResults] = useState<Result[]>([]);
	const [loading, setLoading] = useState(false);
	const [previewResult, setPreviewResult] = useState<{ svg: string; prompt: string } | null>(null);
	const [presets, setPresets] = useState<string[]>([]);

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedSvg, setSelectedSvg] = useState<{ svg: string; prompt: string } | null>(null);
	const [showSettings, setShowSettings] = useState<boolean>(true);

	const [page, setPage] = useState(1);
	const totalPages = 10;

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setPage(newPage);
		}
	};

	const {auth, logout} = useAuth();
	const router = useRouter();

	const handleEnhance = async () => {
		if (auth?.token == null) {
			router.push("/auth");
		}

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
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${auth?.token}`,
					},
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

	const fetchPresets = async (): Promise<string[]> => {
		try {
			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/presets",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${auth?.token}`,
					},
				}
			);

			if (!res.ok) throw new Error("Enhance request failed");

			const response = (await res.json()) as PresetResponse;
			return response.map((v) => v.prompt);
		} catch (e) {
			console.error("Prompt enhancement failed", e);
			return [];
		}
	}

	const handleSvgSelect = (item: { svg: string; prompt: string }) => {
		console.log("User clicked SVG from prompt:", item.prompt);
		console.log("SVG content is:", item.svg);
		setSelectedSvg(item);
		setSidebarOpen(true); // open sidebar instead of showing preview screen
	};
	// helper that returns one SVG string (or throws)
	const fetchSvgs = async (prompt: string): Promise<GenerationResponse> => {
		const payload: SVGGenerationRequest = {
			prompt,
			size: "1024x1024",
			style,
			aspect_ratio: "Not set",
			count: quantity,
		} as any;

		const res = await fetch(
			"https://svgen-backend-production.up.railway.app/v1/svg",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${auth?.token}`,
				},
				body: JSON.stringify(payload),
			}
		);
		if (!res.ok) {
			const txt = await res.text().catch(() => "<unable to read>");
			throw new Error(`HTTP ${res.status}: ${txt}`);
		}

		return await res.json() as GenerationResponse;
	};

	useEffect(() => {
		if (!auth?.token) return;
		// load presets
		fetchPresets().then((list) => setPresets(list));
		// load past generations
		(async () => {
			try {
				const res = await fetch(
					`https://svgen-backend-production.up.railway.app/generations/me?limit=5&offset=${page - 1}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${auth?.token}`,
						},
					}
				);
				if (!res.ok) throw new Error("Failed to fetch generations");
				const data = (await res.json()) as GenerationResponse[];
				const filtered = data
					.filter((v) => v.svgs.length > 0)
					.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
					.map((v) => ({prompt: v.prompt, svgs: v.svgs.map((s) => s.content)}));
				setSvgResults(filtered);
			} catch (e) {
				console.error(e);
			}
		})();
	}, [auth, page]);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const handleSend = async () => {
		if (auth?.token == null) {
			router.push("/auth");
		}

		const prompt = newMessage.trim();
		if (!prompt) return;

		setLoading(true);
		setNewMessage("");

		// create a placeholder Result for this batch
		setSvgResults(current => [
			...current,
			{prompt, svgs: Array(quantity).fill("")}
		]);

		await fetchSvgs(prompt).then(
			(generation) => {
				setSvgResults(current => {
					const newResults = [...current];
					newResults[newResults.length - 1] = {prompt: generation.prompt, svgs: generation.svgs.map((v) => v.content)};
					return newResults;
				});
			}
		).catch(() => {
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
		}).finally(() => setLoading(false));
		// replace the last placeholder with the real svgs
	};

	return (
		<SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			>
				<div
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
					className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
				/>
			</div>

			<div className="w-full max-w-full mx-auto pt-24">
				{previewResult === null &&
					(<div className="w-full max-w-full space-y-4 pt-4">
						{/* Controls */}
						<div className="flex flex-wrap items-start gap-2 border-none max-w-5xl mx-auto px-4"
								 style={{
									 position: "sticky",
									 top: 144,
									 zIndex: 5,
								 }}>
							<div className="relative flex-1 rounded-2xl border-1">

								<Popover>
									<PopoverTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="absolute left-2 bottom-2 h-8 w-8 p-0 rounded-full bg-white hover:bg-gray-100 border-0 shadow-none cursor-pointer"
											aria-label="Settings"
										>
											<Settings2 className="h-4 w-4"/>
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-48 bg-white/80 backdrop-blur-md border-1 border-gray-200 rounded-lg p-2 shadow-md z-[1000]">
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

								{/* Textarea Input */}
								<Textarea
									placeholder="Enter your instructions"
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									className="bg-white/80 backdrop-blur-md shadow-none w-full pr-10 pt-4 px-4 pb-12 rounded-xl focus:outline-none focus-visible:ring-0 max-h-80 resize-none"
								/>

								{/* Send Button */}
								<Button
									onClick={
										() => {
											handleSend().then();
										}
									}
									size="default"
									className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 cursor-pointer"
									aria-label="Send"
								>
									{newMessage.length > 0 ? <ArrowUp className="h-4 w-4"/> : <Mic className="h-4 w-4"/>}
								</Button>

								<Button
									onClick={() => {
										setShowSettings(!showSettings);
									}}
									className="absolute bottom-2 left-2 w-[28px] h-[28px] cursor-pointer rounded-lg shadow-none bg-white/0 backdrop-blur-xl hover:bg-gray-100/80 border-1 text-black">
									<Settings2 className="h-4 w-4"/>
								</Button>
							</div>

							{showSettings && (
								<div
									className="flex flex-nowrap overflow-x-auto space-x-3 pb-2 w-full focus:outline-none focus-visible:ring-0">
									<Select value={style} onValueChange={setStyle}>
										<SelectTrigger
											className="cursor-pointer max-w-[240px] w-auto h-6 text-sm text-end bg-white/80 hover:bg-gray-100/80 backdrop-blur-xl focus:outline-none focus-visible:ring-0 rounded-xl">
											<SelectValue placeholder="Select a style"/>
										</SelectTrigger>

										<SelectContent className="max-h-56 text-sm">
											<SelectGroup>
												<SelectLabel>Styles</SelectLabel>
												{styles.map((s) => (
													<SelectItem key={s} value={s} className="py-1 text-sm">
														{s}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

									<Select value={quantity.toString()} onValueChange={(v) => {
										setQuantity(parseInt(v));
									}}>
										{/* Trigger made ~2x smaller by reducing height and font-size */}
										<SelectTrigger
											className="cursor-pointer w-[64px] h-6 text-sm text-end bg-white/80 hover:bg-gray-100/80 backdrop-blur-xl focus:outline-none focus-visible:ring-0 rounded-xl">
											<SelectValue placeholder="Quantity"/>
										</SelectTrigger>

										<SelectContent className="max-h-56 text-sm">
											<SelectGroup>
												<SelectLabel>Quantities</SelectLabel>
												{quantities.map((s) => (
													<SelectItem key={s} value={s.toString()} className="py-1 text-sm">
														{s}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

									{/* Attach Button */}
									<Button
										onClick={handleEnhance}
										size="icon"
										variant="outline"
										className="h-9 w-9 p-0 rounded-full bg-white hover:bg-gray-100 border-1 shadow-sm cursor-pointer"
										aria-label="Enhance Prompt"
									>
										<Wand2 className="h-4 w-4"/>
									</Button>
								</div>
							)}

						</div>

						{/* Presets */}
						<div className="flex w-full max-w-full flex-nowrap overflow-x-auto space-x-3 pb-2 px-2">
							{presets.map((p, i) => (
								<Badge
									key={i}
									variant="outline"
									className="cursor-pointer text-sm px-2 py-1 rounded-2xl hover:bg-gray-50 bg-white/80 backdrop-blur-xl whitespace-normal overflow-hidden"
									style={{
										display: '-webkit-box',
										WebkitLineClamp: 3,
										WebkitBoxOrient: 'vertical',
									}}
									onClick={() => setNewMessage(p)}
								>
									{p}
								</Badge>
							))}
						</div>

						<div className={"pt-4"}/>

						<div className="max-w-5xl mx-auto px-4">
							<SvgGrid svgResults={svgResults} loading={loading} onSelect={handleSvgSelect}/>
						</div>

						<Pagination className="pt-8 pb-4">
							<PaginationContent>
								{page > 1 &&
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
															e.preventDefault();
															handlePageChange(page - 1);
														}}
                        />
                    </PaginationItem>
								}

								{Array.from(page == 1 ? [page, page + 1, page + 2] : [page - 1, page, page + 1])
									.slice(0, 3) // example: only show first 3 here, you could make it dynamic
									.map((p) => (
										<PaginationItem key={p}>
											<PaginationLink
												href="#"
												isActive={page === p}
												onClick={(e) => {
													e.preventDefault();
													handlePageChange(p);
												}}
											>
												{p}
											</PaginationLink>
										</PaginationItem>
									))}

								<PaginationItem>
									<PaginationEllipsis/>
								</PaginationItem>

								{page < totalPages && <PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault();
											handlePageChange(page + 1);
										}}
									/>
								</PaginationItem>}
							</PaginationContent>
						</Pagination>
					</div>)
				}
			</div>

			<Sidebar side={"right"} variant={"inset"} className={"pt-32 bg-white/80 backdrop-blur-md"}>
				{selectedSvg && (
					<div className="p-4 flex flex-col h-full">
						<button
							onClick={() => setSidebarOpen(false)}
							className="mb-4 text-left text-sm  cursor-pointer"
						>
							<XIcon className="h-5 w-5 text-gray-600"/>
						</button>

						<h3 className="text-lg font-semibold mb-2">{selectedSvg.prompt}</h3>

						<div className="flex gap-4 mb-4">
							<button
								className="btn-outline btn-sm"
								onClick={() => navigator.clipboard.writeText(selectedSvg.svg)}
							>
								<CopyIcon className="h-5 w-5 text-gray-600 cursor-pointer"/>
							</button>
							<button
								className="btn-outline btn-sm"
								onClick={() => {
									const blob = new Blob([selectedSvg.svg], {type: "image/svg+xml"});
									const url = URL.createObjectURL(blob);
									window.open(url, "_blank");
								}}
							>
								<ExternalLink className="h-5 w-5 text-gray-600 cursor-pointer"/>
							</button>
							<button
								className="btn-outline btn-sm"
								onClick={() => {
									const blob = new Blob([selectedSvg.svg], {type: "image/svg+xml"});
									const link = document.createElement("a");
									link.href = URL.createObjectURL(blob);
									link.download = "icon.svg";
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
								}}
							>
								<Download className="h-5 w-5 text-gray-600 cursor-pointer"/>
							</button>
						</div>

						<object
							type="image/svg+xml"
							data={`data:image/svg+xml;utf8,${encodeURIComponent(selectedSvg.svg)}`}
							className="pointer-events-none"
						/>
					</div>
				)}
			</Sidebar>

		</SidebarProvider>
	);
}
