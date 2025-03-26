import { createAdminApiClient } from "@shopify/admin-api-client";
import { log } from "console";
import { NextResponse } from "next/server";



const client = createAdminApiClient({
  storeDomain: process.env.STORE_DOMAIN! ,
  apiVersion: "2025-01",
  accessToken: process.env.ACCESS_TOKEN!,
});

// export async function GET() {
//   const operation = `
//     query ProductMetafield($namespace: String!, $key: String!, $ownerId: ID!) {
//       product(id: $ownerId) {
//         linerMaterial: metafield(namespace: $namespace, key: $key) {
//           value
//         }
//       }
//     }
// `;

//   const { data, errors, extensions } = await client.request(operation, {
//     variables: {
//       namespace: "custom",
//       key: "customer_emails",
//       ownerId: "gid://shopify/Product/14662395396461",
//     },
//   });

//   console.log(errors);
  

//   return NextResponse.json({ data, error: JSON.stringify(errors, null, 2) });
// }

async function GET_CUSTOMER(customerId: string) {
  const operation = `
    query GetCustomer($id: ID!) {
      customer(id: $id) {
        id
        firstName
        lastName
        email
        phone
        createdAt
       
      }
    }
  `;

  const { data, errors } = await client.request(operation, {
    variables: {
      id: `gid://shopify/Customer/${customerId}`, // Replace with the actual customer ID
    },
  });

  // console.log(errors);
    console.log("DATA LOG: " + data.customer.email);

  return NextResponse.json({ data, error: JSON.stringify(errors, null, 2) });
}

export async function POST(request: Request){
const body = await request.json()

console.log("body LOG: " + body.customerId);
GET_CUSTOMER(body.customerId)

return NextResponse.json({message: body})

}