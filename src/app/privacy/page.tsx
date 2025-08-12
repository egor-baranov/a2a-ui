// app/(auth)/login/page.tsx
"use client";

import React from "react";
import AuthForm from "@/components/ui/auth-form";
import {Label} from "@/components/ui/label";
import {useAuth} from "@/providers/AuthProvider";

export default function PrivacyPage() {
	const {auth, logout} = useAuth();

	return (
		<div className="max-w-4xl mx-auto pt-32 space-y-8">
			<h1 className="text-4xl font-medium mb-8">
				{'Privacy policy'}
			</h1>
			<div className="space-y-4 text-sm text-gray-700 mb-8">
				<p>
					At <strong>svgen.nl</strong>, your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our AI-powered SVG generation service.
				</p>
				<h2 className="text-lg font-semibold mt-4">Information We Collect</h2>
				<ul className="list-disc list-inside">
					<li><strong>Personal Data:</strong> When you create an account or log in, we collect your email address and basic profile information.</li>
					<li><strong>Usage Data:</strong> We collect information on how you interact with our service, such as generated SVGs, request logs, and service usage statistics to improve our platform.</li>
					<li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience and analyze site traffic.</li>
				</ul>

				<h2 className="text-lg font-semibold mt-4">How We Use Your Information</h2>
				<ul className="list-disc list-inside">
					<li>To provide and maintain our AI SVG generation services.</li>
					<li>To communicate important updates, changes, or promotional offers (with your consent).</li>
					<li>To analyze and improve the performance, security, and usability of our platform.</li>
					<li>To comply with legal obligations.</li>
				</ul>

				<h2 className="text-lg font-semibold mt-4">Data Sharing and Disclosure</h2>
				<p>
					We do not sell or rent your personal data to third parties. We may share your information with trusted service providers who help us operate the website and provide services, under strict confidentiality agreements.
				</p>

				<h2 className="text-lg font-semibold mt-4">Data Security</h2>
				<p>
					We implement reasonable technical and organizational measures to protect your data from unauthorized access, alteration, or disclosure.
				</p>

				<h2 className="text-lg font-semibold mt-4">Your Rights</h2>
				<p>
					You have the right to access, correct, or delete your personal data. You can also opt out of marketing communications at any time by contacting us.
				</p>

				<h2 className="text-lg font-semibold mt-4">Changes to This Policy</h2>
				<p>
					We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
				</p>

				<h2 className="text-lg font-semibold mt-4">Contact Us</h2>
				<p>
					If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:privacy@svgen.nl" className="text-blue-600 underline">privacy@svgen.nl</a>.
				</p>
			</div>

		</div>
	);
}
