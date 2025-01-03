
import { CircleCheckBig, CircleX } from "lucide-react";
import { notSupportEnhanceConverison, supportCMS } from "./data";
import { useEffect, useState } from "react";

type SupportStatus = "Supported" | "Not Supported" | "Need to manually check";

function isHttps(string: string) {
    try {
        const newUrl = new URL(string);
        return newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
};

const checkSupportCMS = (cms: string): SupportStatus => {
    // remove those special characters
    // eg: SimDif Website Builder V2.02.10408
    // to: simdif website builder v
    const lowerCaseCMS = cms.toLowerCase().replace(/[^a-z]/g, " ");
    if (lowerCaseCMS.indexOf("custom") > - 1) {
        return "Need to manually check";
    }
    if (supportCMS.includes(lowerCaseCMS)) {
        return "Supported";
    };

    return "Not Supported";
};

const checkSupportEC = (cms: string, url: string): boolean => {
    const lowerCaseCMS = cms.toLowerCase();
    if (notSupportEnhanceConverison.includes(lowerCaseCMS) || !isHttps(url)) return false
    return true;
}

export default function Support({ cms, url }: { cms: string, url: string }) {
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [status, setStatus] = useState<SupportStatus>("Not Supported");

    useEffect(() => {
        console.log("cms", cms)
        const status = checkSupportCMS(cms);
        setStatus(status);
        setIsSupported(status !== "Not Supported");
    }, [url, cms]);


    return (
        <div className="pt-4 flex-col space-y-4 justify-center items-center">
            <div className="flex space-x-4 justify-center items-center">
                <p className="text-2xl  font-bold text-gray-400">
                    The website: {status}
                </p>
                {!isSupported ? (
                    <CircleX className="text-red-500" />
                ) : (
                    <CircleCheckBig
                        className="text-green-500"
                    />
                )}
            </div>

            <div className="flex space-x-4 justify-center items-center">
                <p className="text-xl  font-bold text-gray-400">Enhanced Conversion, GA4 UPD</p>
                {checkSupportEC(cms, url) && isSupported ? (
                    <CircleCheckBig
                        className="text-green-500"
                    />
                ) : (
                    <CircleX className="text-red-500" />
                )}
            </div>
        </div>
    )
}