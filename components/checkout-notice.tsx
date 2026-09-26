"use client";

import { useEffect, useState } from "react";

type CheckoutState = "checking" | "open" | "closed" | "paused" | "unknown";

export function CheckoutNotice() {
  const [state, setState] = useState<CheckoutState>("checking");

  useEffect(() => {
    let cancel = false;
    fetch("/api/status")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("status"))))
      .then((data: { stripeConfigured?: boolean; paused?: boolean }) => {
        if (cancel) return;
        if (data.paused) setState("paused");
        else if (data.stripeConfigured) setState("open");
        else setState("closed");
      })
      .catch(() => {
        if (!cancel) setState("unknown");
      });
    return () => {
      cancel = true;
    };
  }, []);

  if (state === "checking") {
    return <p>Checking whether card checkout is open.</p>;
  }

  if (state === "open") {
    return (
      <form className="space-y-4" method="post" action="/api/checkout">
        <input type="hidden" name="product" value="poyais-working-file" />
        <p className="hidden" aria-hidden="true">
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <button
          className="bg-ink px-4 py-2 text-sm text-paper hover:bg-rust"
          type="submit"
        >
          Pay $9 and continue to checkout
        </button>
        <p className="text-sm">
          The next page is Stripe. Almost Lore does not see your card number. If you close it
          before paying, you are not charged.
        </p>
      </form>
    );
  }

  if (state === "paused") {
    return (
      <p>
        Checkout is paused. The file is not being sold right now, and there is nothing to pay.
      </p>
    );
  }

  if (state === "closed") {
    return (
      <p>
        Card checkout is not connected yet, so this file is not on sale. You cannot be charged
        from this page. The essay stays free. When a merchant account is connected, this page
        will show a $9 checkout button and not before.
      </p>
    );
  }

  return (
    <p>
      Checkout status could not be confirmed, so the pay button stays off. Refresh the page.
      Nothing is charged while status is unknown.
    </p>
  );
}
