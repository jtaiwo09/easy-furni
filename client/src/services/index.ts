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
