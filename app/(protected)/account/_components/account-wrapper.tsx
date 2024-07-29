import { auth } from "@/auth";
import Content from "./content";
import { getUser } from "@/db/user";
import ContentWrapper from "./content-wrapper";


const getUserData = async (userId: string) => {
    try {
        const data = await getUser(userId);
        console.log(data)
        return data
    } catch (err) {
        console.error(err);
        return null
    }
}


const AccountWrapper = async () => {

    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const userData = await getUserData(session.user.id);

    if (!userData) {
        return null
    }

    return (
        <ContentWrapper>
            <Content session={session} userData={userData} />
        </ContentWrapper>
    );
}

export default AccountWrapper;