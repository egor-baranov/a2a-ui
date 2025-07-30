"use client";

import React, {useState} from "react";
import Header from "@/components/Header";
import CreatePage from "@/app/create/page";
import ExplorePage from "@/app/explore/page";
import LoginPage from "@/app/login/page";
import LandingPage from "@/components/LandingPage";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Copy, Download, Edit} from "lucide-react";
import Paywall from "@/components/Paywall";


export default function HomePage() {

	return (
		<div className="bg-white text-black">
			{/* 1. Hero Section */}
			<section className="py-24 px-6 text-center">
				<h1 className="text-5xl font-extrabold mb-4">svgen</h1>
				<p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
					Instantly generate and customize SVG icons & logos with our clean,
					monochrome interface—focus on creativity.
				</p>
				<div className="flex justify-center gap-4">
					<Button size="lg" className="bg-black text-white hover:bg-gray-800">
						Try It Free
					</Button>
					<Button size="lg" variant="outline" className="border-black text-black hover:bg-gray-100">
						View Docs
					</Button>
				</div>
			</section>

			{/* 2. Core Features Section */}
			<section className="py-16 px-6">
				<h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					<Card className="border border-gray-200">
						<CardContent className="text-center">
							<Copy className="mx-auto mb-4 h-8 w-8 text-black" />
							<h3 className="text-xl font-semibold mb-2">Instant Icons</h3>
							<p className="text-gray-700">
								Generate SVG icons instantly via AI-driven prompts, styled to your
								needs.
							</p>
						</CardContent>
					</Card>

					<Card className="border border-gray-200">
						<CardContent className="text-center">
							<Edit className="mx-auto mb-4 h-8 w-8 text-black" />
							<h3 className="text-xl font-semibold mb-2">Logo Designer</h3>
							<p className="text-gray-700">
								Customize shapes, fonts, and layouts for professional logos.
							</p>
						</CardContent>
					</Card>

					<Card className="border border-gray-200">
						<CardContent className="text-center">
							<Download className="mx-auto mb-4 h-8 w-8 text-black" />
							<h3 className="text-xl font-semibold mb-2">Easy Export</h3>
							<p className="text-gray-700">
								Download clean SVG files or copy code for seamless integration.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* 3. How It Works Section */}
			<section className="py-20 px-6 bg-gray-50">
				<h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
					{/* Step 1 */}
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-2">
							1
						</div>
						<h3 className="text-xl font-semibold">Define Your Style</h3>
						<p className="text-gray-700">
							Enter a prompt or pick one of our curated templates to set the mood
							and style for your icon or logo.
						</p>
					</div>

					{/* Step 2 */}
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-2">
							2
						</div>
						<h3 className="text-xl font-semibold">Customize & Preview</h3>
						<p className="text-gray-700">
							Tweak shapes, colors, and typography in real‑time. Preview variants
							side‑by‑side until you’re happy.
						</p>
					</div>

					{/* Step 3 */}
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-2">
							3
						</div>
						<h3 className="text-xl font-semibold">Export & Integrate</h3>
						<p className="text-gray-700">
							Download your SVG or copy the markup to paste directly into your
							projects—no extra tools needed.
						</p>
					</div>
				</div>
			</section>

			{/* 4. Example Gallery Section */}
			<section className="py-16 px-6">
				<h2 className="text-3xl font-bold text-center mb-12">Example Gallery</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
					{/* Placeholder squares for generated SVG previews */}
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="border border-gray-200 rounded-lg h-32 flex items-center justify-center text-gray-400"
						>
							SVG Preview
						</div>
					))}
				</div>
			</section>

			<Paywall/>

			{/* 5. Call to Action Section */}
			<section className="py-20 px-6 bg-black text-white text-center">
				<h2 className="text-3xl font-bold mb-6">
					Start generating SVGs now
				</h2>
				<div className="flex justify-center gap-4">
					<Button size="lg" className="bg-white text-black hover:bg-gray-200">
						Try It Free
					</Button>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-6 text-center text-gray-600">
				<p className="mb-2">&copy; {new Date().getFullYear()} svgen. All rights reserved.</p>
				<div className="space-x-4">
					<a href="#" className="hover:text-black">
						Privacy Policy
					</a>
					<a href="#" className="hover:text-black">
						Terms of Service
					</a>
				</div>
			</footer>
		</div>
	);
}