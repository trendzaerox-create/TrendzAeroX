import ShiprocketCreateClient from "./ShiprocketCreateClient";

export default function ShiprocketCreatePage({ params }) {
  return <ShiprocketCreateClient orderId={params.id} />;
}
