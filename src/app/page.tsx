"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import HomePage from "@/components/HomePage";

export default function HomePageWrapper() {
    return (
      <Elements stripe={stripePromise}>
          <HomePage />
      </Elements>
    );
}

