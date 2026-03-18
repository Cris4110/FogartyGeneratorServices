import { waveRequest } from "./waveService.js";

export async function createInvoice(customerId, amount, description) {

  const query = `
  mutation InvoiceCreate($input: InvoiceCreateInput!) {
    invoiceCreate(input: $input) {
      didSucceed
      inputErrors {
        message
        code
        path
      }
      invoice {
        id
        invoiceNumber
        viewUrl
        pdfUrl

      }

        
    }
  }`;

  const variables = {
    input: {
      businessId: process.env.WAVE_BUSINESS_ID,
      customerId: customerId,
      currency: "USD",

      items: [
        {
          productId: process.env.WAVE_PRODUCT_ID,
          description: description,
          unitPrice: amount,
        }
      ]
    }
  };

  const data = await waveRequest(query, variables);

  // For debugging: log the full response from Wave
  //console.log("Wave invoice response:", JSON.stringify(data, null, 2));

  if (!data?.data?.invoiceCreate?.didSucceed) {
    console.error("Wave invoice errors:", data.data.invoiceCreate.inputErrors);
    throw new Error("Wave invoice creation failed");
  }

  return data.data.invoiceCreate.invoice;
}