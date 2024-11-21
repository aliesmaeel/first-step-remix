// app/routes/app.product.new.jsx
import { createProduct } from "../productApi";

export const action = async ({ request }) => {
  return await createProduct(request);
};
