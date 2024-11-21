
import { json } from "@remix-run/node";
import { authenticate } from "./shopify.server";

export async function createProduct(request) {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green", "Blue", "White", "Gray", "Black", "Purple"][
    Math.floor(Math.random() * 9)
    ];

  const productResponse = await admin.graphql(
    `#graphql
    mutation CreateProductWithNewMedia($input: ProductInput!, $media: [CreateMediaInput!]) {
      productCreate(input: $input, media: $media) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
        media: [
          {
            alt: `${color} Snowboard Image`,
            mediaContentType: "IMAGE",
            originalSource: "https://via.placeholder.com/150.png?text=Snowboard",
          },
        ],
      },
    }
  );

  const responseJson = await productResponse.json();
  if (responseJson.data.productCreate.userErrors.length > 0) {
    return json({ errors: responseJson.data.productCreate.userErrors }, { status: 400 });
  }

  return json({ product: responseJson.data.productCreate.product });
}
