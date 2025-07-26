import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, MenuIcon, XIcon } from "lucide-react";
import type { Tab } from "@/components/HomePage";

interface HeaderProps {
	activeTab: Tab;
	setActiveTab: (tab: Tab) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="bg-white border-b p-4 flex items-center justify-between md:justify-start md:gap-8">
			{/* Logo */}
			<div className="flex items-center gap-2 pl-2">
				<SparklesIcon className="w-5 h-5 text-primary" />
				<span className="text-xl font-bold">svgen.io</span>
			</div>

			{/* Desktop Nav */}
			<nav className="hidden md:flex gap-2 ml-auto pr-4">
				<Button
					variant={activeTab === "generate" ? "default" : "ghost"}
					onClick={() => setActiveTab("generate")}
				>
					Generate
				</Button>
				<Button
					variant={activeTab === "explore" ? "default" : "ghost"}
					onClick={() => setActiveTab("explore")}
				>
					Explore
				</Button>
				<Button
					variant={activeTab === "login" ? "default" : "ghost"}
					onClick={() => setActiveTab("login")}
				>
					Login
				</Button>
			</nav>

			{/* Mobile Menu Button */}
			<button
				className="md:hidden p-2 ml-auto"
				onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
			</button>

			{/* Mobile Nav */}
			{mobileMenuOpen && (
				<div className="absolute top-16 left-0 w-full bg-white border-t shadow-md flex flex-col z-50 md:hidden">
					<Button
						variant={activeTab === "generate" ? "default" : "ghost"}
						onClick={() => {
							setActiveTab("generate");
							setMobileMenuOpen(false);
						}}
						className="w-full justify-start"
					>
						Generate
					</Button>
					<Button
						variant={activeTab === "explore" ? "default" : "ghost"}
						onClick={() => {
							setActiveTab("explore");
							setMobileMenuOpen(false);
						}}
						className="w-full justify-start"
					>
						Explore
					</Button>
					<Button
						variant={activeTab === "login" ? "default" : "ghost"}
						onClick={() => {
							setActiveTab("login");
							setMobileMenuOpen(false);
						}}
						className="w-full justify-start"
					>
						Login
					</Button>
				</div>
			)}
		</header>
	);
}
