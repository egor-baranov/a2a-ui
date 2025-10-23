"use client";

import React, {useRef} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {ArrowRight, ArrowUp, Copy, Download, Edit, RocketIcon, SearchIcon} from "lucide-react";
import Paywall from "@/components/Paywall";
import Link from "next/link";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
import {Label} from "@/components/ui/label";

import {CloudArrowUpIcon, LockClosedIcon, ServerIcon} from '@heroicons/react/20/solid'
import SvgGrid from "@/components/SvgGrid";
import GradientRoundedFooter from "@/components/ui/rounded-footer";
import QAndA from "@/components/QA";
import ModernAnimatedButtonVariant1 from "@/components/ui/animated-button";
import PreviewStickyFooter, {StickyFooter} from "@/components/ui/sticky-footer";
import {BorderTrail} from "@/components/ui/border-trail";
import StackingCardsDemo from "@/components/landing/stacking-cards";
import StackingCards, {StackingCardItem} from "@/components/fancy/blocks/stacking-cards";
import {cn} from "@/lib/utils";
import Image from "next/image";

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


function Bento() {
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">

				<h2 className="text-center text-base/7 font-semibold text-black">Explore features</h2>
				<p className="mx-auto mt-2 max-w-xl text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
					Industry-leading generation powered by AI
				</p>
				<div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
					<div className="transform-gpu hover:-translate-y-4 transition duration-500 relative lg:row-span-2">
						<div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
							<div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
									Mobile friendly
								</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
									With svgen you can generate vector images anywhere with account synchronization across all your devices.
								</p>
							</div>
							<div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
								<div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-900 bg-gray-900 shadow-2xl">
									<img
										alt=""
										src="/landing/screenshot-1.png"
										className="size-full object-cover object-top"
									/>
								</div>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl" />
					</div>
					<div className="transform-gpu hover:-translate-y-4 transition duration-500 relative max-lg:row-start-1">
						<div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
							<div className="px-8 pt-8 sm:px-10 sm:pt-10">
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Performance</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
									Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.
								</p>
							</div>
							<div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
								<img
									alt=""
									src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
									className="w-full max-lg:max-w-xs"
								/>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl" />
					</div>
					<div className="transform-gpu hover:-translate-y-4 transition duration-500 relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
						<div className="absolute inset-px rounded-lg bg-white" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
							<div className="px-8 pt-8 sm:px-10 sm:pt-10">
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Security</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
									Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.
								</p>
							</div>
							<div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
								<img
									alt=""
									src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
									className="h-[min(152px,40cqw)] object-cover"
								/>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
					</div>
					<div className="transform-gpu hover:-translate-y-4 transition duration-500 relative lg:row-span-2">
						<div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl" />
						<div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
							<div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
								<p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
									Powerful APIs
								</p>
								<p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
									Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.
								</p>
							</div>
							<div className="relative min-h-120 w-full grow">
								<div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl outline outline-white/10">
									<div className="flex bg-gray-900 outline outline-white/5">
										<div className="-mb-px flex text-sm/6 font-medium text-gray-400">
											<div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
												NotificationSetting.jsx
											</div>
											<div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
										</div>
									</div>
									<div className="px-6 pt-6 pb-14 text-white">Sample code</div>
								</div>
							</div>
						</div>
						<div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
					</div>
				</div>
			</div>
		</div>
	)
}


function NeedASuitableIcon() {
	return (
		<div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -top-100 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			>
				<div
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
					className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
				/>
			</div>

			<div
				className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
				<div
					className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
					<div className="lg:pr-4">
						<div className="lg:max-w-lg">
							<div className="flex flex-row items-center gap-2">
								<RocketIcon className="w-4 h-4"/>
								<p className="text-base/7 font-semibold text-black">Deploy faster</p>
							</div>
							<h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
								Advanced generation
							</h1>
							<p className="mt-6 text-xl/8 text-gray-700">
								Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam
								eget aliquam. Quisque id at vitae feugiat egestas.
							</p>
						</div>
					</div>
				</div>
				<div
					className="-mt-12 -ml-12 p-12 sm:pt-8 lg:pt-40 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
					<img
						alt=""
						src="/landing/sample-1.png"
						className="w-3xl max-w-none rounded-xl bg-white border-none shadow-xl ring-1 ring-gray-400/10 sm:w-228"
					/>
				</div>
				<div
					className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
					<div className="lg:pr-4">
						<div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg">
							<p>
								Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
								vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
								erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
								semper sed amet vitae sed turpis id.
							</p>
							<ul role="list" className="mt-8 space-y-8 text-gray-600">
								<li className="flex gap-x-3">
									<CloudArrowUpIcon aria-hidden="true" className="mt-1 size-5 flex-none text-black"/>
									<span>
                    <strong className="font-semibold text-gray-900">Push to deploy.</strong> Lorem ipsum, dolor sit amet
                    consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate
                    blanditiis ratione.
                  </span>
								</li>
								<li className="flex gap-x-3">
									<LockClosedIcon aria-hidden="true" className="mt-1 size-5 flex-none text-black"/>
									<span>
                    <strong className="font-semibold text-gray-900">SSL certificates.</strong> Anim aute id magna aliqua
                    ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                  </span>
								</li>
								<li className="flex gap-x-3">
									<ServerIcon aria-hidden="true" className="mt-1 size-5 flex-none text-black"/>
									<span>
                    <strong className="font-semibold text-gray-900">Database backups.</strong> Ac tincidunt sapien
                    vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.
                  </span>
								</li>
							</ul>
							<p className="mt-8">
								Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor
								fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac
								adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
							</p>
							<h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">No server? No problem.</h2>
							<p className="mt-6">
								Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
								Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
								tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam
								turpis ipsum eu a sed convallis diam.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function NeedASuitableIcon2() {
	return (
		<div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -top-100 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			>
				<div
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
					className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
				/>
			</div>

			<div
				className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
				<div
					className="lg:col-span-2 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
					<div className="lg:pr-4">
						<div className="lg:max-w-lg">
							<div className="flex flex-row items-center gap-2">
								<SearchIcon className="w-4 h-4"/>
								<p className="text-base/7 font-semibold text-black">Spend less time searching for icons</p>
							</div>
							<h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
								Explore thousands of icons
							</h1>
							<p className="mt-6 text-xl/8 text-gray-700">
								Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui,
								diam eget aliquam. Quisque id at vitae feugiat egestas.
							</p>
						</div>
					</div>
				</div>
				<div
					className="-mt-12 -ml-12 p-12 sm:pt-8 lg:pt-40 lg:sticky lg:top-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
					<img
						alt="App screenshot"
						src="/landing/sample-2.png"
						className="w-3xl max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-228 transform lg:-translate-x-1/4 sm:-translate-x-1/2"
					/>
				</div>
				<div
					className="lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
					<div className="lg:pr-4">
						<div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg">
							<p>
								Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
								vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
								erat velit.
							</p>
							<ul role="list" className="mt-8 space-y-8 text-gray-600">
								<li className="flex gap-x-3">
									<CloudArrowUpIcon aria-hidden="true" className="mt-1 size-5 flex-none text-black"/>
									<span>
                    <strong className="font-semibold text-gray-900">Push to deploy.</strong> Lorem ipsum, dolor sit amet
                    consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate
                    blanditiis ratione.
                  </span>
								</li>
								<li className="flex gap-x-3">
									<LockClosedIcon aria-hidden="true" className="mt-1 size-5 flex-none text-black"/>
									<span>
                    <strong className="font-semibold text-gray-900">SSL certificates.</strong> Anim aute id magna aliqua
                    ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                  </span>
								</li>
								<li className="flex gap-x-3">
									<ServerIcon aria-hidden="true" className="mt-1 size-5 flex-none text-black"/>
									<span>
                    <strong className="font-semibold text-gray-900">Database backups.</strong> Ac tincidunt sapien
                    vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.
                  </span>
								</li>
							</ul>
							<p className="mt-8">
								Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor
								fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac
								adipiscing egestas.
							</p>
							<h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">No server? No problem.</h2>
							<p className="mt-6">
								Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
								Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
								tellus mauris, ultrices mauris.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function HomePage() {

	const containerRef = useRef<HTMLDivElement | null>(null);
	const router = useRouter();

	return (
		<div className="bg-white text-black" ref={containerRef}>
			<div className="relative isolate px-6 pt-28 lg:px-8">
				<div
					aria-hidden="true"
					className="absolute inset-x-0 -top-100 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
					/>
				</div>
				<div
					aria-hidden="true"
					className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
					/>
				</div>
			</div>

			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
			>
				<div
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
					className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
				/>
			</div>


			{/*<Bento/>*/}

			{/*<NeedASuitableIcon/>*/}

			{/*<NeedASuitableIcon2/>*/}

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
							<Button size="lg" className="rounded-full text-md py-6 bg-black text-white hover:bg-gray-800 w-full sm:w-auto cursor-pointer">
								Get started for free
							</Button>
						</Link>
						<Link href="/explore" passHref>
							<Button
								size="lg"
								variant="outline"
								className="rounded-full text-md py-6 border-gray-300 text-black hover:bg-gray-100 w-full sm:w-auto cursor-pointer"
							>
								Explore icons
							</Button>
						</Link>
					</div>
				</section>

				{cards.map(({ bgColor, description, image, title }, index) => (
					<StackingCardItem key={index} index={index} className="lg:h-[960px] lg:px-64 h-[720px] duration-500 lg:pt-32 pt-24 sm:pt-8">
						<div
							className={cn(
								bgColor,
								"h-[80%] sm:h-[70%] flex-col aspect-video px-8 py-10 flex w-11/12 rounded-4xl mx-auto relative text-black bg-white/90 backdrop-blur-md border-1"
							)}
						>
							<div className="flex-1 flex flex-col justify-center items-center">
								<h3 className="font-medium text-4xl mb-5">{title}</h3>
								<p className="text-center mb-2">{description}</p>
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

			{/*/!* 4. Example Gallery Section *!/*/}
			{/*<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 items-center justify-items-center">*/}
			{/*	<h2 className="text-5xl font-medium text-center mb-4">Example Gallery</h2>*/}
			{/*	<SvgGrid svgResults={[]}/>*/}
			{/*</section>*/}

			<section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-48 items-center justify-items-center">
				<h2 className="text-5xl font-medium text-center mb-8">Subscription plans</h2>
				<Paywall/>
			</section>

			<section className="py-12 sm:py-12 lg:px-48 sm:px-8 px-4">
				<h2 className="text-5xl font-medium text-center mb-8">Q&A</h2>
				<QAndA/>
			</section>

			<GradientRoundedFooter className="pt-16"/>
		</div>
	);
}
