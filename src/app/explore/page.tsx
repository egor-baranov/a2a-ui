"use client";

import React, {useState} from "react";
import {Copy, Edit, Download} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import SvgGrid from "@/components/SvgGrid";

const sampleSVGs = [
	`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black"><circle cx="12" cy="12" r="10" stroke-width="2" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black"><rect x="4" y="4" width="16" height="16" stroke-width="2" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="black"><line x1="4" y1="20" x2="20" y2="4" stroke-width="2" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"><path d="M12 2L2 12h10V2z" /></svg>`,
	`<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24"><path d="M2 2h20v20H2z" /></svg>`,
];

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="w-full max-w-5xl mx-auto px-4 pt-4 space-y-6">
			<div className="flex flex-wrap items-start gap-2 border-1 rounded-2xl shadow-sm">
				<div className="relative flex-1 rounded-3xl">
					<Textarea
						placeholder="Enter search query"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="bg-white shadow-none w-full pr-10 pt-4 px-4 pb-4 rounded-2xl focus:outline-none focus-visible:ring-0 max-h-40 resize-none"
					/>
				</div>
			</div>

			<SvgGrid svgResults={[{svgs: sampleSVGs, prompt: "Samples"}]}/>

		</div>
	);
}
