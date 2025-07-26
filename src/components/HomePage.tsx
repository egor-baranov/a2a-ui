"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import GenerateTab from "@/components/GenerateTab";
import ExploreTab from "@/components/ExploreTab";
import LoginTab from "@/components/LoginTab";

export type Tab = "generate" | "explore" | "login";

export default function HomePage() {
	const [activeTab, setActiveTab] = useState<Tab>("generate");

	return (
		<div className="h-screen flex flex-col overflow-hidden">
		<Header activeTab={activeTab} setActiveTab={setActiveTab} />
	<main className="flex-grow overflow-auto px-6 pt-8">
		{activeTab === "generate" && <GenerateTab />}
	{activeTab === "explore" && <ExploreTab />}
	{activeTab === "login" && <LoginTab />}
	</main>
	</div>
);
}