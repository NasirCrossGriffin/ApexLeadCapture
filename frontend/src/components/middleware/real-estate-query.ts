// estimateQuery.middleware.ts
// Same style as your previous middleware examples

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type RealEstateQuery = {
  organization : String,
  user : String,
  address : String,
  city : String,
  state : String,
  zipCode : String,
  facingForeclosure : Boolean,
  currentLoanBalance : String | null,
  amountBehind : String | null,
  loanType : String | null,
  lenderName : String | null,
  auctionDate : String | null,
  description : String | null,
  consultationDate : String,
  service : String | null,
};

export type RealEstateQueryUpdate = Partial<RealEstateQuery>;

export async function CreateRealEstateQuery(protoRealEstateQuery: RealEstateQuery) {
  try {
    const response = await fetch(`${BASE_URL}/api/real-estate-query`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(protoRealEstateQuery),
    });

    if (response.ok) {
      const newEstimateQuery = await response.json();
      return newEstimateQuery;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimateQueries(
  filters?: { bodyShop?: string; user?: string; status?: string }
) {
  try {
    const params = new URLSearchParams();
    if (filters?.bodyShop) params.append("bodyShop", filters.bodyShop);
    if (filters?.user) params.append("user", filters.user);
    if (filters?.status) params.append("status", filters.status);

    const url = `${BASE_URL}/api/real-estate-query${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const estimateQueries = await response.json();
      return estimateQueries;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getRealEstateQueriesByOrganization(organizationId : string) {
  try {
    const response = await fetch(`${BASE_URL}/api/real-estate-query/organization/${organizationId}`, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const estimateQueries = await response.json();
      return estimateQueries;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimateQueryById(estimateQueryId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/real-estate-query/${encodeURIComponent(estimateQueryId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "GET",
      }
    );

    if (response.ok) {
      const estimateQuery = await response.json();
      return estimateQuery;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateRealEstateQuery(
  realEstateQueryId: string,
  updates: any
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/real-estate-query/${encodeURIComponent(realEstateQueryId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    if (response.ok) {
      const updatedRealEstateQuery = await response.json();
      return updatedRealEstateQuery;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteRealEstateQuery(realEstateQueryId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/real-estate-query/${encodeURIComponent(realEstateQueryId)}`,
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
