"use client";
import React from "react";
import { Copy, Edit, Download } from "lucide-react";
import PaymentRequestButton from "@/components/ui/PaymentRequestButton";

export default function ExploreTab() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{/* placeholder items + actions */}
			<PaymentRequestButton />
		</div>
	);
}