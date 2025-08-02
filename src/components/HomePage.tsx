"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Copy, Download, Edit} from "lucide-react";
import Paywall from "@/components/Paywall";
import Link from "next/link";
import {Textarea} from "@/components/ui/textarea";


export default function HomePage() {

	return (
		<div className="bg-white text-black">
			{/* 1. Hero Section */}
			<section className="pt-24 pb-16 px-6 text-center justify-center items-center">
				<h1 className="text-7xl font-extrabold mb-0">Generate thousands of icons</h1>
				<h1 className="text-7xl font-extrabold mb-4">in seconds with svgen</h1>
				<p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
					Explore the limitless opportunities via industry-leading vector graphics generation superpowered by AI
				</p>

				<div className="flex items-center justify-center max-w-full mb-4">
					<div className="flex flex-wrap gap-2 border-1 rounded-2xl shadow-sm min-w-200">
						<div className="relative flex-1 rounded-3xl">
							<Textarea
								placeholder="Enter your instructions"
								className="bg-white shadow-none w-full pr-10 pt-4 px-4 pb-4 rounded-2xl focus:outline-none focus-visible:ring-0 max-h-40 resize-none"
							/>
						</div>
					</div>
				</div>

				<div className="flex justify-center gap-4">
					<Link key={"Sign in"} href={"/create"} passHref>
						<Button size="lg" className="bg-black text-white hover:bg-gray-800 cursor-pointer">
							Get started for free
						</Button>
					</Link>
					<Link key={"Explore"} href={"/explore"} passHref>
						<Button size="lg" variant="outline" className="border-1 text-black hover:bg-gray-100 cursor-pointer">
							Explore icons
						</Button>
					</Link>
				</div>
			</section>

			{/* 2. Core Features Section */}
			<section className="py-16 px-6">
				<h2 className="text-4xl font-bold text-center mb-4">Need a suitable icon? Just generate it!</h2>
				<p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8 text-center">
					No more searching for specific icon for your needs – now in just a several clicks you can make assets with lots of styles for any task
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					<Card className="border border-gray-200 shadow-none hover:border-gray-300 hover:shadow-sm cursor-pointer">
						<CardContent className="text-center">
							<Copy className="mx-auto mb-4 h-8 w-8 text-black"/>
							<h3 className="text-xl font-semibold mb-2">Instant Icons</h3>
							<p className="text-gray-700">
								Generate SVG icons instantly via AI-driven prompts, styled to your
								needs.
							</p>
						</CardContent>
					</Card>

					<Card className="border border-gray-200 shadow-none hover:border-gray-300 hover:shadow-sm cursor-pointer">
						<CardContent className="text-center">
							<Edit className="mx-auto mb-4 h-8 w-8 text-black"/>
							<h3 className="text-xl font-semibold mb-2">Logo Designer</h3>
							<p className="text-gray-700">
								Customize shapes, fonts, and layouts for professional logos.
							</p>
						</CardContent>
					</Card>

					<Card className="border border-gray-200 shadow-none hover:border-gray-300 hover:shadow-sm cursor-pointer">
						<CardContent className="text-center">
							<Download className="mx-auto mb-4 h-8 w-8 text-black"/>
							<h3 className="text-xl font-semibold mb-2">Easy Export</h3>
							<p className="text-gray-700">
								Download clean SVG files or copy code for seamless integration.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* 2. Core Features Section */}
			<section className="py-16 px-6">
				<h2 className="text-4xl font-bold text-center mb-4">Custom icons made for you by AI</h2>
				<p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8 text-center">
					No more searching for specific icon for your needs – now in just a several clicks you can make assets with lots of styles for any task
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					<Card className="border border-gray-200 shadow-none hover:border-gray-300 hover:shadow-sm cursor-pointer">
						<CardContent className="text-center">
							<Copy className="mx-auto mb-4 h-8 w-8 text-black"/>
							<h3 className="text-xl font-semibold mb-2">Instant Icons</h3>
							<p className="text-gray-700">
								Generate SVG icons instantly via AI-driven prompts, styled to your
								needs.
							</p>
						</CardContent>
					</Card>

					<Card className="border border-gray-200 shadow-none hover:border-gray-300 hover:shadow-sm cursor-pointer">
						<CardContent className="text-center">
							<Edit className="mx-auto mb-4 h-8 w-8 text-black"/>
							<h3 className="text-xl font-semibold mb-2">Logo Designer</h3>
							<p className="text-gray-700">
								Customize shapes, fonts, and layouts for professional logos.
							</p>
						</CardContent>
					</Card>

					<Card className="border border-gray-200 shadow-none hover:border-gray-300 hover:shadow-sm cursor-pointer">
						<CardContent className="text-center">
							<Download className="mx-auto mb-4 h-8 w-8 text-black"/>
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
						<h3 className="text-xl font-semibold">Write a prompt</h3>
						<p className="text-gray-700">
							Enter a prompt or pick one of our curated templates to set the mood
							and style for your icon or logo.
						</p>
					</div>

					{/* Step 2 */}
					<div className="flex flex-col items-center text-center space-y-4">
						<h3 className="text-xl font-semibold">View generated icons</h3>
						<p className="text-gray-700">
							Tweak shapes, colors, and typography in real‑time. Preview variants
							side‑by‑side until you’re happy.
						</p>
					</div>

					{/* Step 3 */}
					<div className="flex flex-col items-center text-center space-y-4">
						<h3 className="text-xl font-semibold">Export & Use</h3>
						<p className="text-gray-700">
							Download your SVG or copy the markup to paste directly into your
							projects—no extra tools needed.
						</p>
					</div>
				</div>
			</section>

			{/* 4. Example Gallery Section */}
			<section className="py-16 px-16">
				<h2 className="text-3xl font-bold text-center mb-12">Example Gallery</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
					{/* Placeholder squares for generated SVG previews */}
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="border border-gray-200 rounded-lg h-48 w-48 flex items-center justify-center text-gray-400"
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
					<Link key={"Create"} href={"/create"} passHref>
						<Button size="lg" className="bg-white text-black hover:bg-gray-200 cursor-pointer">
							Get started for free
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-6 text-center text-gray-600">
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