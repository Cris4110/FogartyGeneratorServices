import { waveRequest } from "./waveService.js";

export async function createCustomer(name, email) {
  const query = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      didSucceed
      customer {
        id
        name
        email
      }
    }
  }`;
  const query3 = `
  query {
    business(id: "${process.env.WAVE_BUSINESS_ID}") {     
    products {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}`;

  const variables = {
    input: {
      businessId: process.env.WAVE_BUSINESS_ID,
      name: name,
      email: email
    }
  };

  const data = await waveRequest(query, variables);
  /* for testing purposes only to see what the queries return
  const data2 = await waveRequest(query2, variables);
  const data3 = await waveRequest(query3, variables);
  console.log("Wave response:", JSON.stringify(data, null, 2));
  console.log("Wave response 2:", JSON.stringify(data2, null, 2));
  console.log("Wave response 3:", JSON.stringify(data3, null, 2));
  */

  return data.data.customerCreate.customer;
}