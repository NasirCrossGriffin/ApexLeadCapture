// estimate.middleware.ts
// Same style as your previous middleware functions

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Estimate = {
  estimateQuery: string;
  price: number;
};

export type EstimateUpdate = Partial<Estimate>;

export async function createEstimate(protoEstimate: Estimate) {
  try {
    const response = await fetch(`${BASE_URL}/api/estimate`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(protoEstimate),
    });

    if (response.ok) {
      const newEstimate = await response.json();
      return newEstimate;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimates(estimateQueryId?: string) {
  try {
    const url = estimateQueryId
      ? `${BASE_URL}/api/estimate?estimateQuery=${encodeURIComponent(
          estimateQueryId
        )}`
      : `${BASE_URL}/api/estimate`;

    const response = await fetch(url, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const estimates = await response.json();
      return estimates;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimateById(estimateId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimate/${encodeURIComponent(estimateId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "GET",
      }
    );

    if (response.ok) {
      const estimate = await response.json();
      return estimate;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateEstimate(
  estimateId: string,
  updates: EstimateUpdate
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimate/${encodeURIComponent(estimateId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    if (response.ok) {
      const updatedEstimate = await response.json();
      return updatedEstimate;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteEstimate(estimateId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimate/${encodeURIComponent(estimateId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "DELETE",
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result; // { deleted: true, id: ... }
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
