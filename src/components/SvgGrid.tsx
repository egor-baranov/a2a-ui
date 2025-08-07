"use client";

import React, { useState } from "react";
import { Copy, Edit, Download } from "lucide-react";
import {TiltEffect} from "@/utils/TiltEffect";

interface SvgGridProps {
	svgResults: { svgs: string[]; prompt: string }[];
	loading?: boolean;
	onSelect?: (item: { svg: string; prompt: string }) => void;
}

export default function SvgGrid({ svgResults, loading, onSelect }: SvgGridProps) {
	const [activeKey, setActiveKey] = useState<string | null>(null);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const downloadSVG = (svg: string, filename = "icon.svg") => {
		const blob = new Blob([svg], { type: "image/svg+xml" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleEdit = (svg: string) => {
		alert("Edit feature not implemented yet");
	};

	const handleTap = (key: string, svg: string, prompt: string) => {
		setActiveKey((prev) => (prev === key ? null : key));
		onSelect?.({ svg, prompt });
	};

	if (loading && svgResults.length === 0) {
		return <div className="text-center py-8">Loading...</div>;
	}

	return (
		<div className="space-y-8">
			{svgResults.toReversed().map(({ prompt, svgs }, groupIdx) => (
				<section key={groupIdx}>
					{/* Prompt Header with Copy */}
					<div className="flex items-center justify-start space-x-2 mb-4">
						<h3 className="text-lg font-semibold truncate">{prompt}</h3>
						<button
							onClick={() => copyToClipboard(prompt)}
							aria-label="Copy Prompt"
							className="p-1 hover:bg-gray-200 rounded cursor-pointer"
						>
							<Copy className="w-4 h-4 text-gray-500" />
						</button>
					</div>

					{/* SVG Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{svgs.map((svg, svgIdx) => {
							const key = `${groupIdx}-${svgIdx}`;

							return (
								<TiltEffect key={key}>
									<div className="flex flex-col items-center">
										<div
											onClick={() => handleTap(key, svg, prompt)}
											className="hover:shadow-xl shadow-gray-100 group aspect-square w-full rounded-2xl bg-white border overflow-hidden flex items-center justify-center relative cursor-pointer"
										>
											{!svg ? (
												<div className="w-full h-full animate-pulse bg-gray-200" />
											) : (
												<>
													<object
														type="image/svg+xml"
														data={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
														className="max-w-full max-h-full flex-grow pointer-events-none"
													/>
													<div
														className={`absolute bottom-2 right-2 flex gap-2 bg-white bg-opacity-80 rounded-md p-1 shadow-md transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${
															activeKey === key ? "opacity-100" : ""
														}`}
													>
														<button
															onClick={(e) => {
																e.stopPropagation();
																copyToClipboard(svg);
															}}
															aria-label="Copy SVG"
															className="p-1 hover:bg-gray-200 rounded"
														>
															<Copy className="w-4 h-4" />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleEdit(svg);
															}}
															aria-label="Edit SVG"
															className="p-1 hover:bg-gray-200 rounded"
														>
															<Edit className="w-4 h-4" />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																downloadSVG(svg);
															}}
															aria-label="Download SVG"
															className="p-1 hover:bg-gray-200 rounded"
														>
															<Download className="w-4 h-4" />
														</button>
													</div>
												</>
											)}
										</div>
									</div>
								</TiltEffect>
							);
						})}
					</div>
				</section>
			))}
		</div>
	);
}
