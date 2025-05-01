import { useState, useEffect } from "react";

function useXRayData(document) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchXRayData() {
      setIsLoading(true);
      setError(null);

      try {
        // Send request to backend API instead of directly using the x_ray_url
        const encodedXRayUrl = encodeURIComponent(document.xrayUrl);
        const resp = await fetch(
          `/api/documents/xray?xrayUrl=${encodedXRayUrl}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!resp.ok) {
          throw new Error("Failed to fetch xray data");
        }
        const data = await resp.json();
        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchXRayData();
  }, [document]);

  return { data, isLoading, error };
}

export default useXRayData;
