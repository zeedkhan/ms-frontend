import { LockKeyhole } from "lucide-react";
function Page() {
    return (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center space-y-4">
            <LockKeyhole size={128} />
            <p className='font-bold'>Permission denied!</p>
        </div>
    )
}


export default Page;