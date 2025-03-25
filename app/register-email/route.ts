import { createAdminApiClient } from "@shopify/admin-api-client";
import { log } from "console";
import { NextResponse } from "next/server";

const client = createAdminApiClient({
  storeDomain: process.env.STORE_DOMAIN!,
  apiVersion: "2025-01",
  accessToken: process.env.ACCESS_TOKEN!,
});

async function getEmailsForProduct(productId: string): Promise<string[]> {
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
      ownerId: `gid://shopify/Product/${productId}`, //Need to get the id from the form
    },
  });



  console.log(data, errors)
  const emails = data.product.emails?.value
  
  if(!emails){
    return []
  }
  return  JSON.parse(emails)
}

async function updateProductEmails(emailToAdd: string, currentEmails: string[] , productId: string) {
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
         ownerId: `gid://shopify/Product/${productId}`, //need to get this from the form (same value as above)
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
  const { email, productId } = body;


  const currentEmails = await getEmailsForProduct(productId)
  
  const email_already_exists = currentEmails.find(e => e == email)

if(email_already_exists) { 
    return NextResponse.json({ message: "This email is already in the list" }, { status: 400 });
}

  const result = await updateProductEmails(email, currentEmails, productId)
  return NextResponse.json(result);
}
