"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { verifyEmail } from "@/actions/verify-email";
import CardWrapper from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSucess } from "@/components/form-sucess";
import { FormLoading } from "../form-loading";



const NewVerificationForm = () => {

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const attempVerify = useRef(false);

  const onSubmit = useCallback(() => {
    if (success || error || attempVerify.current) return;
    attempVerify.current = true;
    setLoading(true)
    if (!token) {
      setError("Missing token!");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      }).finally(() => setLoading(false));
  }, [token, success, error]);


  useEffect(() => {
    onSubmit()
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center justify-center w-full">
        {loading && <FormLoading />}
        <FormSucess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
