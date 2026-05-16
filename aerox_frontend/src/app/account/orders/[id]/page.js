

import { Suspense } from "react";
import OrderDetailsClient from "./OrderDetailsClient";

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <OrderDetailsClient />
    </Suspense>
  );
}