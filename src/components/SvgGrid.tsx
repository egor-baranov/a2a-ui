"use client";

import React, { useState } from "react";
import { Copy, Edit, Download } from "lucide-react";

interface SvgGridProps {
	svgResults: { svg: string | null; prompt: string }[];
	loading?: boolean;
}

export default function SvgGrid({ svgResults, loading }: SvgGridProps) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const copyToClipboard = (svg: string) => {
		navigator.clipboard.writeText(svg);
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

	const handleTap = (index: number) => {
		setActiveIndex((prev) => (prev === index ? null : index));
	};

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{svgResults.map(({ svg, prompt }, idx) => (
				<div key={idx} className="flex flex-col items-center">
					{/* SVG Card */}
					<div
						onClick={() => handleTap(idx)}
						className="group aspect-square w-full rounded-2xl bg-gray-50 border overflow-hidden p-4 flex flex-col items-center justify-center relative"
					>
						{svg === null ? (
							<div className="w-full h-full animate-pulse bg-gray-200" />
						) : (
							<>
								<object
									type="image/svg+xml"
									data={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
									className="max-w-full max-h-full flex-grow pointer-events-none"
								/>

								{/* Action Buttons */}
								<div
									className={`
										absolute bottom-2 right-2 flex gap-2
										bg-white bg-opacity-80 rounded-md p-1 shadow-md
										transition-opacity duration-200
										opacity-0 group-hover:opacity-100
										${activeIndex === idx ? "opacity-100" : ""}
									`}
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

					{/* Prompt Below Card */}
					<div className="w-full text-xs text-center text-gray-500 mt-1 truncate">
						{prompt}
					</div>
				</div>
			))}
		</div>
	);
}
