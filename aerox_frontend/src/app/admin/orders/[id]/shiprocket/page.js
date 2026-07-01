// import ShiprocketCreateClient from "./ShiprocketCreateClient";

// export default async function ShiprocketCreatePage({ params }) {
//   const { id } = await params;

//   return <ShiprocketCreateClient orderId={id} />;
// }













import ShiprocketCreateClient from "./ShiprocketCreateClient";

export default async function ShiprocketCreatePage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <ShiprocketCreateClient orderId={id} />;
}