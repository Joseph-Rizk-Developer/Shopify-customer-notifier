import { createAdminApiClient } from "@shopify/admin-api-client";
import { log } from "console";
import { NextResponse } from "next/server";

const client = createAdminApiClient({
  storeDomain: process.env.STORE_DOMAIN!,
  apiVersion: "2025-01",
  accessToken: process.env.ACCESS_TOKEN!,
});

async function getEmailsForProduct(): Promise<string[]> {
  const operation = `
    query ProductMetafield($namespace: String!, $key: String!, $ownerId: ID!) {
      product(id: $ownerId) {
        emails: metafield(namespace: $namespace, key: $key) {
          value
        }
      }
    }
`;

  const { data, errors, extensions } = await client.request(operation, {
    variables: {
      namespace: "custom",
      key: "customer_emails",
      ownerId: "gid://shopify/Product/14662395396461", //Need to get the id from the form
    },
  });



  return  JSON.parse(data.product.emails.value)
}

async function updateProductEmails(emailToAdd: string, currentEmails: string[]) {
  const operation = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
     metafieldsSet(metafields: $metafields) {
       metafields {
         key
         namespace
         value
         createdAt
         updatedAt
       }
       userErrors {
         field
         message
         code
       }
     }
   }
`;


const emails = [...currentEmails, emailToAdd]

 const { data, errors } = await client.request(operation, {
   variables: {
     metafields: [
       {
         namespace: "custom",
         key: "customer_emails",
         ownerId: "gid://shopify/Product/14662395396461", //need to get this from the form (same value as above)
         type: "list.single_line_text_field",
         value: JSON.stringify(emails),
       },
     ],
   },
 });

 return {data, errors}
}

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { email } = body;

  const currentEmails = await getEmailsForProduct()
  
  const email_already_exists = currentEmails.find(e => e == email)

if(email_already_exists) { 
    return NextResponse.json({ message: "This email is already in the list" }, { status: 400 });
}

  const result = await updateProductEmails(email, currentEmails)
  return NextResponse.json(result);
}
