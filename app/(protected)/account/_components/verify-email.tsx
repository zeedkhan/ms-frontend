import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AUTH_ROUTES } from "@/routes";
import axios from "axios";
import { BadgeCheck, Loader } from "lucide-react";
import { useState } from "react";

type VerifyEmailProps = {
    email: string;
    domain: string;
}



const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, domain }) => {

    const [success, setSuccess] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const sendVerify = async () => {
        setLoading(true)
        try {
            const payload = {
                email,
                domain
            };

            const request = await axios.post(AUTH_ROUTES.verifyEmail, payload);

            const response = await request.data;

            setSuccess("verification sent")
            console.log(response)
        } catch (err) {
            setError("There was a problem!")
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
                <p>
                    not verified
                </p>
                <Card
                    className="flex px-1 py-0.5 cursor-pointer hover:bg-gray-50">
                    <BadgeCheck className={`${loading ? "pointer-events-none" : ""} text-red-600`} aria-disabled={loading} />
                </Card>
            </div>
            <Button
                className="border space-x-2"
                variant={"secondary"}
                onClick={sendVerify}
                type="button"
            >
                {loading && (
                    <Loader className="animate-spin" />
                )}
                <p>Send verification</p>
            </Button>
            {success && (
                <p>{success}</p>
            )}
            {error && (
                <p>{error}</p>
            )}
        </div>
    )
}

export default VerifyEmail;