// author: Khoa Phan <https://www.pldkhoa.dev>

"use client"

import React, { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import StackingCards, {
	StackingCardItem,
} from "@/components/fancy/blocks/stacking-cards"

const cards = [
	{
		bgColor: "bg-[#f97316]",
		title: "The Guiding Light",
		description:
			"Lighthouses have stood as beacons of hope for centuries, guiding sailors safely through treacherous waters. Their glowing light and towering presence serve as a reminder of humanity’s connection to the sea.",
		image:
			"https://plus.unsplash.com/premium_vector-1739262161806-d954eb02427c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
	},
	{
		bgColor: "bg-[#0015ff]",
		title: "Life Beneath the Waves",
		description:
			"From shimmering schools of fish to solitary hunters, the ocean is home to an incredible variety of marine life. Each species plays a vital role in maintaining the balance of underwater ecosystems.",
		image:
			"https://plus.unsplash.com/premium_vector-1739200616200-69a138d91627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
	},
	{
		bgColor: "bg-[#ff5941]",
		title: "Alone on the Open Sea",
		description:
			"Drifting across the endless horizon, traveling alone on the sea is a test of courage and resilience. With nothing but the waves and the sky, solitude becomes both a challenge and a source of deep reflection.",
		image:
			"https://plus.unsplash.com/premium_vector-1738597190290-a3b571590b9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OHxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
	},
	{
		bgColor: "bg-[#1f464d]",
		title: "The Art of Sailing",
		description:
			"Harnessing the power of the wind, sailing is both a skill and an adventure. Whether racing across the waves or leisurely cruising, it’s a timeless way to explore the vast blue expanse.",
		image:
			"https://plus.unsplash.com/premium_vector-1738935247245-97940c74cced?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D",
	},
	{
		bgColor: "bg-[#0015ff]",
		title: "The Era of Whaling",
		description:
			"Once a thriving industry, whale hunting shaped economies and cultures across the world. Today, efforts to protect these majestic creatures highlight the shift toward conservation and respect for marine life.",
		image:
			"https://plus.unsplash.com/premium_vector-1738935247692-1c2f2c924fd8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MjJ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D",
	},
]

import { useRef } from "react"
import Paywall from "@/components/Paywall";
import QAndA from "@/components/QA";
import GradientRoundedFooter from "@/components/ui/rounded-footer";
import {BorderTrail} from "@/components/ui/border-trail";
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import {useRouter} from "next/navigation";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {Label} from "@/components/ui/label";

export default function StackingCardsDemo() {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const router = useRouter();

	return (
		<div
			className="h-[800px] bg-white overflow-auto text-white"
			ref={containerRef}
		>
			<StackingCards
				totalCards={cards.length}
				scrollOptons={{ container: containerRef }}
			>
				{/* 1. Hero Section */}
				<section className="pt-20 pb-12 px-6 sm:px-6 lg:px-40 text-center items-center justify-items-center">
					<h1 className="text-4xl text-black sm:text-4xl md:text-6xl lg:text-7xl font-semibold mb-2">
						Create production-ready assets in seconds using AI
					</h1>
					<p className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto text-base sm:text-lg text-gray-700 mb-6">
						Explore limitless opportunities via industry-leading vector graphics generation superpowered by AI.
					</p>

					<div
						className="flex mb-6 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-3xl justify-items-center justify-center items-center shadow-none rounded-2xl
             focus-within:ring-2 border-1 focus-within:ring-transparent">

						<div className="bg-white/30 backdrop-blur-sm rounded-2xl flex sm:flex-row flex-col w-full items-end px-2">
							<BorderTrail
								style={{
									boxShadow:
										"0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
								}}
								size={100}
							/>

							<Textarea
								placeholder="Create icons, logos and vector images in seconds"
								className="rounded-2xl overscroll-none border-none px-4 py-4 focus:outline-none focus-visible:ring-0 resize-none shadow-none min-h-12 w-full"
								rows={1}
							/>

							<Button
								onClick={() => router.push("/auth")}
								size="default"
								className="relative bottom-2 flex justify-items-end right-0 rounded-md h-8 p-0 cursor-pointer bg-gradient-to-r from-[#FBDAEC] to-[#F5EDA4]"
								aria-label="Send"
							>
								<Label className="cursor-pointer text-black">Generate now</Label>
								<ArrowRight className="h-4 w-4 text-black font-bold flex justify-end"/>
							</Button>
						</div>
					</div>

					<div className="flex flex-row justify-center gap-3">
						<Link href="/create" passHref>
							<Button size="lg" className="text-md py-6 bg-black text-white hover:bg-gray-800 w-full sm:w-auto cursor-pointer">
								Get started for free
							</Button>
						</Link>
						<Link href="/explore" passHref>
							<Button
								size="lg"
								variant="outline"
								className="text-md py-6 border-gray-300 text-black hover:bg-gray-100 w-full sm:w-auto cursor-pointer"
							>
								Explore icons
							</Button>
						</Link>
					</div>
				</section>


				{cards.map(({ bgColor, description, image, title }, index) => (
					<StackingCardItem key={index} index={index} className="h-[800px] transform-gpu hover:-translate-y-2 transition duration-500">
						<div
							className={cn(
								bgColor,
								"h-[80%] sm:h-[70%] flex-col sm:flex-row aspect-video px-8 py-10 flex w-11/12 rounded-3xl mx-auto relative"
							)}
						>
							<div className="flex-1 flex flex-col justify-center">
								<h3 className="font-bold text-2xl mb-5">{title}</h3>
								<p>{description}</p>
							</div>

							<div className="w-full sm:w-1/2 rounded-xl aspect-video relative overflow-hidden">
								<Image
									src={image}
									alt={title}
									className="object-cover"
									fill
								/>
							</div>
						</div>
					</StackingCardItem>
				))}
			</StackingCards>
		</div>
	)
}
