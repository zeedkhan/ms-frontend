import { auth } from "@/auth";
import { getUserBlogs } from "@/db/blog";

const getData = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }
  
  const data = await getUserBlogs(session.user.id);
  return data;
}


const Dashbaord = async () => {
  const getReport = await getData();
    return (
      <div>
        {JSON.stringify(getReport)}
      </div>
    );
}

export default Dashbaord;