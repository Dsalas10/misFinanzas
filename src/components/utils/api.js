// const BASE_URL = "https://backfinanza.onrender.com/api";
const BASE_URL = "http://localhost:5000/api";

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }
  return res.json();
};

export const api = {
  get: async (endpoint, params = "") => {
    const res = await fetch(
      `${BASE_URL}/${endpoint}${params ? `/${params}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handleResponse(res);
  },
  post: async (endpoint, body) => {

    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  put: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  delete: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
};
