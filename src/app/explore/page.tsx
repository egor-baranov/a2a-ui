"use client";

import React, {useState} from "react";
import {Search} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import SvgGrid from "@/components/SvgGrid";
import type {components} from "@/types/api-types";
import {Button} from "@/components/ui/button";

type GenerationResponse = components["schemas"]["GenerationResponse"];
type ExploreRequest = components["schemas"]["ExploreRequest"];

type Result = { svgs: string[]; prompt: string };

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [svgResults, setSvgResults] = useState<Result[]>([]);

	const fetchExplore = async (prompt: string): Promise<GenerationResponse[]> => {
		const payload: ExploreRequest = {
			query: prompt,
			limit: 100
		} as any;

		const res = await fetch(
			"https://svgen-backend-production.up.railway.app/explore",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);

		if (!res.ok) {
			const txt = await res.text().catch(() => "<unable to read>");
			throw new Error(`HTTP ${res.status}: ${txt}`);
		}

		return await res.json() as GenerationResponse[];
	};

	function fetchData(query: string) {
		(fetchExplore(query)).then(
			res => {
				setSvgResults(
					res.filter((v) => v.svgs.length > 0)
						.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime() )
						.map((v) => (
							{
								prompt: v.prompt,
								svgs: v.svgs.map((s) => s.content)
							}
						) as Result)
				);
			}
		);
	}

	return (
		<div className="w-full max-w-5xl mx-auto px-4 space-y-6 pt-28">
			<div className="flex flex-wrap items-start gap-2 border-1 rounded-2xl shadow-sm">
				<div className="relative flex-1 rounded-3xl">
					<Textarea
						placeholder="Enter search query"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
						}}
						className="bg-white shadow-none w-full pr-10 pt-4 px-4 pb-4 rounded-2xl focus:outline-none focus-visible:ring-0 max-h-40 resize-none"
					/>

					<Button
						onClick={
							() => {
								fetchData(searchQuery);
							}
						}
						size="default"
						className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 cursor-pointer"
						aria-label="Send"
					>
						<Search className="h-4 w-4"/>
					</Button>
				</div>
			</div>

			<SvgGrid svgResults={svgResults}/>
		</div>
	);
}
