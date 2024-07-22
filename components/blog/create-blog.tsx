import EditorWrapper from "../editor/wrapper-editor"
import { Blog } from "@/types"

type CreateBlogProps = {
    blog: Blog
    blogId: string | null
}

const CreateBlog: React.FC<CreateBlogProps> = ({ blog, blogId }) => {
    return (
        <EditorWrapper blog={blog} blogId={blogId} />
    )
}

export default CreateBlog