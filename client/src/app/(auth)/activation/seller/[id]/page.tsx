"use client";
import { baseUrl } from "@/server";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Layout/Loader";

function page() {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const activation_token = params.id;

  useEffect(() => {
    const sendRequest = async () => {
      const res = await fetch(`${baseUrl}/shop/activation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activation_token }),
      });
      setIsLoading(false);

      if (res.ok) {
        return;
      } else {
        setError(true);
      }
    };
    sendRequest();
  }, [activation_token]);
  if (isLoading) return <Loader />;
  else
    return (
      <div className="min-h-[calc(100vh-70px)] flex justify-center items-center">
        <div className="-mt-[70px]">
          {error ? (
            <p>Your token is expired!</p>
          ) : (
            <p>Your account has been created suceessfully!</p>
          )}
        </div>
      </div>
    );
}

export default page;
