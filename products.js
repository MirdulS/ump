const API_BASE_URL = 'http://localhost:5000/api';

// ✅ GET all products
export const fetchProducts = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized: Please log in.');

  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await response.text();
  console.log('[fetchProducts] Status:', response.status);
  console.log('[fetchProducts] Raw:', raw);

  if (!response.ok) throw new Error(`Error ${response.status}: ${raw}`);

  const json = raw ? JSON.parse(raw) : [];
  return json.products || []; // Adjusted for your JSON response structure
};

// ✅ POST - Create a new product
export const createProduct = async (token, productData) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const result = await res.json();
  console.log('[createProduct] Response:', result);

  if (!res.ok) throw new Error(result.message || 'Failed to create product');
  return result;
};

// ✅ PUT - Update existing product
export const updateProduct = async (token, productId, updatedData) => {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  const result = await res.json();
  console.log('[updateProduct] Response:', result);

  if (!res.ok) throw new Error(result.message || 'Failed to update product');
  return result;
};

// ✅ DELETE - Delete a product
export const deleteProductById = async (token, productId) => {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  console.log('[deleteProductById] Response:', result);

  if (!res.ok) throw new Error(result.message || 'Failed to delete product');
  return result;
};
