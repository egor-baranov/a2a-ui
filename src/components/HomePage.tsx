"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Edit } from "lucide-react";
import Paywall from "@/components/Paywall";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default function HomePage() {
	return (
		<div className="bg-white text-black">
			{/* 1. Hero Section */}
			<section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center items-center">
				<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2">
					Generate thousands of icons in seconds with svgen
				</h1>
				<p className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto text-base sm:text-lg text-gray-700 mb-6">
					Explore limitless opportunities via industry-leading vector graphics generation superpowered by AI.
				</p>

				<div className="flex justify-center mb-6 px-2 w-full max-w-full">
					<Textarea
						placeholder="Enter your instructions"
						className="w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-3xl bg-white rounded-2xl border-1 px-4 py-3 focus:ring-0 focus:border-gray-300 resize-none"
						rows={2}
					/>
				</div>

				<div className="flex flex-col sm:flex-row justify-center gap-3">
					<Link href="/create" passHref>
						<Button size="lg" className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
							Get started for free
						</Button>
					</Link>
					<Link href="/explore" passHref>
						<Button
							size="lg"
							variant="outline"
							className="border-gray-300 text-black hover:bg-gray-100 w-full sm:w-auto"
						>
							Explore icons
						</Button>
					</Link>
				</div>
			</section>

			{/* 2. Core Features Section */}
			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
					Need a suitable icon? Just generate it!
				</h2>
				<p className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto text-base sm:text-lg text-gray-700 mb-8 text-center">
					No more searching for that perfect icon – in just a few clicks you can create assets in any style.
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
					{[{ icon: Copy, title: "Instant Icons", desc: "Generate SVG icons instantly via AI-driven prompts, styled to your needs." },
						{ icon: Edit, title: "Logo Designer", desc: "Customize shapes, fonts, and layouts for professional logos." },
						{ icon: Download, title: "Easy Export", desc: "Download clean SVG files or copy code for seamless integration." }
					].map(({ icon: Icon, title, desc }, idx) => (
						<Card key={idx} className="border border-gray-200 shadow-none hover:shadow-sm transition-shadow">
							<CardContent className="text-center py-6">
								<Icon className="mx-auto mb-4 h-8 w-8 text-black" />
								<h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
								<p className="text-gray-700 text-sm sm:text-base">{desc}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* 3. How It Works Section */}
			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">How It Works</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
					{[
						{ step: "Write a prompt", desc: "Enter a prompt or pick one of our templates to set the mood and style." },
						{ step: "View generated icons", desc: "Preview variants side-by-side and tweak shapes in real-time." },
						{ step: "Export & Use", desc: "Download SVG or copy markup directly—no extra tools needed." },
					].map(({ step, desc }, idx) => (
						<div key={idx} className="flex flex-col items-center text-center space-y-2">
							<h3 className="text-lg sm:text-xl font-semibold">{step}</h3>
							<p className="text-gray-700 text-sm sm:text-base">{desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* 4. Example Gallery Section */}
			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
				<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8">Example Gallery</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="border border-gray-200 rounded-lg h-32 sm:h-40 flex items-center justify-center text-gray-400 text-sm"
						>
							SVG Preview
						</div>
					))}
				</div>
			</section>

			<Paywall />

			{/* 5. Call to Action Section */}
			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-black text-white text-center">
				<h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">Start generating SVGs now</h2>
				<Link href="/create" passHref>
					<Button size="lg" className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto">
						Get started for free
					</Button>
				</Link>
			</section>

			{/* Footer */}
			<footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
				<p className="mb-2">&copy; {new Date().getFullYear()} svgen. All rights reserved.</p>
				<div className="space-x-4">
					<a href="/privacy" className="hover:text-black">
						Privacy Policy
					</a>
					<a href="/terms-of-service" className="hover:text-black">
						Terms of Service
					</a>
				</div>
			</footer>
		</div>
	);
}
