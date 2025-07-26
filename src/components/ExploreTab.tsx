"use client";

import React from "react";
import { Copy, Edit, Download } from "lucide-react";
import PaymentRequestButton from "@/components/ui/PaymentRequestButton";

const sampleSVGs = [
	`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black"><circle cx="12" cy="12" r="10" stroke-width="2" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black"><rect x="4" y="4" width="16" height="16" stroke-width="2" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black"><line x1="4" y1="20" x2="20" y2="4" stroke-width="2" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"><path d="M12 2L2 12h10V2z" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"><path d="M2 2h20v20H2z" /></svg>`,
];

export default function ExploreTab() {
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
		alert("Edit feature not implemented yet.");
	};

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{sampleSVGs.map((svg, idx) => (
				<div
					key={idx}
					className="group aspect-square rounded-2xl bg-gray-50 border overflow-hidden p-4 flex items-center justify-center relative"
				>
					<object
						type="image/svg+xml"
						data={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
						className="max-w-full max-h-full"
					/>
					<div
						className="absolute bottom-2 right-2 flex gap-2 bg-white bg-opacity-80 rounded-md p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<button
							onClick={() => copyToClipboard(svg)}
							className="p-1 hover:bg-gray-200 rounded"
							aria-label="Copy"
						>
							<Copy className="w-4 h-4" />
						</button>
						<button
							onClick={() => handleEdit(svg)}
							className="p-1 hover:bg-gray-200 rounded"
							aria-label="Edit"
						>
							<Edit className="w-4 h-4" />
						</button>
						<button
							onClick={() => downloadSVG(svg, `icon-${idx + 1}.svg`)}
							className="p-1 hover:bg-gray-200 rounded"
							aria-label="Download"
						>
							<Download className="w-4 h-4" />
						</button>
					</div>
				</div>
			))}
			{/* Payment CTA at the end */}
			<div className="col-span-full">
				<PaymentRequestButton />
			</div>
		</div>
	);
}
