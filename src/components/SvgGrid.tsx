"use client";

import React from "react";
import { Copy, Edit, Download } from "lucide-react";

interface SvgGridProps {
	svgResults: (string | null)[];
	loading?: boolean;
}

export default function SvgGrid({ svgResults, loading }: SvgGridProps) {
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

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{svgResults.map((svg, idx) => (
				<div
					key={idx}
					className="group aspect-square rounded-2xl bg-gray-50 border overflow-hidden p-4 flex flex-col items-center justify-center relative"
				>
					{svg === null ? (
						<div className="w-full h-full animate-pulse bg-gray-200" />
					) : (
						<>
							<object
								type="image/svg+xml"
								data={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
								className="max-w-full max-h-full flex-grow"
							/>
							<div
								className="
                  absolute bottom-2 right-2 flex gap-2
                  bg-white bg-opacity-80 rounded-md p-1 shadow-md
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                "
							>
								<button
									onClick={() => copyToClipboard(svg)}
									aria-label="Copy SVG"
									className="p-1 hover:bg-gray-200 rounded"
								>
									<Copy className="w-4 h-4" />
								</button>
								<button
									onClick={() => handleEdit(svg)}
									aria-label="Edit SVG"
									className="p-1 hover:bg-gray-200 rounded"
								>
									<Edit className="w-4 h-4" />
								</button>
								<button
									onClick={() => downloadSVG(svg)}
									aria-label="Download SVG"
									className="p-1 hover:bg-gray-200 rounded"
								>
									<Download className="w-4 h-4" />
								</button>
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
}
