"use client"

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
	className?: string;
};

/**
 * GradientRoundedFooter
 * - Light, full-bleed pastel gradient inspired by the Header Banner
 * - Decorative clipped gradient blobs, but more subtle (lighter + lower opacity)
 * - Content stays constrained to max-w-6xl while background spans full viewport width
 */
export default function GradientRoundedFooter({ className = "" }: Props) {
	const year = new Date().getFullYear();

	const clipPath =
		'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)';

	return (
		<footer className={`w-full ${className}`} aria-labelledby="footer-heading">
			{/* Full-bleed wrapper: uses w-screen & translate to escape parent padding so gradient touches viewport edges */}
			<div className="relative left-1/2 right-1/2 max-w-7xl -translate-x-1/2 overflow-hidden rounded-t-4xl">

				{/* Light pastel gradient background (subtle) */}
				<div className="relative bg-gradient-to-r from-[#FBDAEC] to-[#F5EDA4]  p-6 sm:p-8">

					{/* Left decorative blob (lighter, subtle) */}
					<div
						aria-hidden="true"
						className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl opacity-20"
					>
						<div
							style={{ clipPath }}
							className="aspect-[577/310] w-[36rem] bg-gradient-to-r from-[#F788D7] to-[#FAF59F]"
						/>
					</div>

					{/* Right decorative blob (mirrored, lighter) */}
					<div
						aria-hidden="true"
						className="absolute top-1/2 right-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl opacity-20"
					>
						<div
							style={{ clipPath }}
							className="aspect-[577/310] w-[36rem] bg-gradient-to-r from-[#F788D7] to-[#FAF59F]"
						/>
					</div>

					{/* Constrained content */}
					<div className="max-w-6xl mx-auto px-4">
						{/* CTA Section */}
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="text-center sm:text-left">
								<h2 id="footer-heading" className="text-2xl sm:text-3xl font-semibold text-black">
									Start generating vector images now
								</h2>
								<p className="mt-2 text-sm text-black/80">Fast, lightweight SVGs for your projects — fully customizable.</p>
							</div>

							<div className="w-full sm:w-auto">
								<Link href="/create" passHref>
									<Button size="lg" className="w-full sm:w-auto inline-flex items-center justify-center">
										Get started for free
									</Button>
								</Link>
							</div>
						</div>

						{/* Decorative separator */}
						<div className="mt-6">
							<Separator className="bg-black/10" />
						</div>

						{/* Footer small print */}
						<div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-black/75 gap-3">
							<p className="order-2 sm:order-1">&copy; {year} svgen. All rights reserved.</p>

							<div className="flex items-center space-x-4 order-1 sm:order-2">
								<Link href="/privacy" className="underline-offset-2 hover:underline">
									Privacy Policy
								</Link>
								<Link href="/terms-of-service" className="underline-offset-2 hover:underline">
									Terms of Service
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
