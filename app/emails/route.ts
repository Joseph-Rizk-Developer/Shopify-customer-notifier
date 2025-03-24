import { createAdminApiClient } from "@shopify/admin-api-client";
import { log } from "console";
import { NextResponse } from "next/server";



const client = createAdminApiClient({
  storeDomain: process.env.STORE_DOMAIN! ,
  apiVersion: "2025-01",
  accessToken: process.env.ACCESS_TOKEN!,
});

export async function GET() {
  const operation = `
    query ProductMetafield($namespace: String!, $key: String!, $ownerId: ID!) {
      product(id: $ownerId) {
        linerMaterial: metafield(namespace: $namespace, key: $key) {
          value
        }
      }
    }
`;

  const { data, errors, extensions } = await client.request(operation, {
    variables: {
      namespace: "custom",
      key: "customer_emails",
      ownerId: "gid://shopify/Product/14662395396461",
    },
  });

  console.log(errors);
  

  return NextResponse.json({ data, error: JSON.stringify(errors, null, 2) });
}
