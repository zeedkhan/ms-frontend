import { useEffect, useState } from "react";

const useEnumerateDevices = () => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            setDevices(devices);

            devices.forEach((device) => {
                console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
            });
        });
    }, []);

    return devices;
}

export default useEnumerateDevices;