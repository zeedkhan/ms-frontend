import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { EnhanceButton } from './ui/enhance-button';
import { Download } from 'lucide-react';

const DownloadZip = ({ files }: { files: Blob[] }) => {
    const [isZipping, setIsZipping] = useState(false);

    const handleDownload = async () => {
        setIsZipping(true);
        const zip = new JSZip();
        files.forEach((file, index) => {
            const filename = `file-${index + 1}.png`;
            zip.file(filename, file);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'download.zip');
        setIsZipping(false);
    };

    if (!files.length) {
        return null;
    }

    return (
        <EnhanceButton
            variant={"outline"}
            className="rounded-full border flex items-center space-x-4 px-8 py-5"
            size={'sm'}
            onClick={handleDownload}
            disabled={isZipping}
        >
            <Download />
            <p>{isZipping ? 'Zipping...' : 'Download as Zip'}</p>
        </EnhanceButton>
    );
};

export default DownloadZip;
