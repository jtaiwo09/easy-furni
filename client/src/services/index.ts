import { baseUrl } from "@/server";

export const getBanks = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYSTACK_BASEURL}/bank/?country=Nigeria`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
        "cache-control": "no-cache",
      },
    }
  );

  if (res.ok) {
    const result = await res.json();
    return result.data;
  } else throw Error("Error fetching banks");
};

export const nameInquiry = async (accountNumber: any, bankCode: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYSTACK_BASEURL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (res.ok) {
    const result = await res.json();
    return result.data;
  } else {
    throw Error("Wrong account details provided");
  }
};

// Delete Cloudinary Image
export const deleteCloudinaryImageApi = async (publicId: string) => {
  const res = await fetch(`${baseUrl}/util/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  } else {
    throw new Error(result);
  }
};

// Delete Cloudinary Image
export const uploadCloudinaryImageApi = async (images: any) => {
  const res = await fetch(`${baseUrl}/util/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ images }),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  } else {
    throw new Error(result);
  }
};
