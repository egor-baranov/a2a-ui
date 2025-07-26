import React, { useEffect, useState } from 'react';
import { useStripe, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import type { PaymentRequest } from '@stripe/stripe-js';

const PaymentRequestButton: React.FC = () => {
	const stripe = useStripe();
	const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
	const [canMakePayment, setCanMakePayment] = useState(false);

	useEffect(() => {
		console.log("Stripe from useStripe:", stripe);
		if (!stripe) {
			console.warn("Stripe is null — likely <Elements> is not wrapping this component correctly.");
		}
	}, [stripe]);

	useEffect(() => {
		if (!stripe) return;

		const pr = stripe.paymentRequest({
			country: 'US',
			currency: 'usd',
			total: {
				label: 'Demo Total',
				amount: 5000, // $50.00
			},
			requestPayerName: true,
			requestPayerEmail: true,
		});

		pr.canMakePayment().then(result => {
			if (result) {
				setPaymentRequest(pr);
				setCanMakePayment(true);
			}
		});

		pr.on('paymentmethod', async (ev) => {
			// TODO: Send ev.paymentMethod.id to your backend and confirm the payment there
			ev.complete('success');
			alert('Payment successful!');
		});
	}, [stripe]);

	if (!canMakePayment || !paymentRequest) return null;

	return (
		<div style={{ maxWidth: '300px', margin: '20px 0' }}>
			<PaymentRequestButtonElement
				options={{ paymentRequest }}
				// no style prop here
			/>
		</div>
	);
};

export default PaymentRequestButton;
