import React from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import type { Tab } from "@/components/HomePage";

interface HeaderProps {
	activeTab: Tab;
	setActiveTab: (tab: Tab) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
	return (
		<header className="bg-white border-b p-4 flex items-center justify-between">
			<h1 className="pl-4 text-xl font-bold flex items-center gap-2">
				<SparklesIcon className="w-4 h-4" />
				svgen
			</h1>
			<nav className="space-x-2 pr-4">
				<Button variant="ghost" onClick={() => setActiveTab("generate")}>Generate</Button>
				<Button variant="ghost" onClick={() => setActiveTab("explore")}>Explore</Button>
				<Button variant="default" onClick={() => setActiveTab("login")}>Login</Button>
			</nav>
		</header>
	);
}