import AccountWrapper from "./_components/account-wrapper";
import CustomBreadCrumb from "@/components/custom-bread-crumb";

const title = "Account";

const routes = [{
    title: "Home",
    url: "/"
}, {
    title: title,
    url: `/${title}`
}]

const Account = () => {
    return (
        <>
            <CustomBreadCrumb routes={routes} />
            <AccountWrapper />
        </>

    );
}

export default Account;