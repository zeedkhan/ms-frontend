import { FC, memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeRaw from "rehype-raw";
import { CodeBlock } from "./codeblock"
import { cn } from "@/lib/utils"

const MemoizedReactMarkdown: FC<Options> = memo(ReactMarkdown, (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.className === nextProps.className)

export default function Markdown({ content }: { content: string }) {

    return (
        <MemoizedReactMarkdown
            className="prose dark:prose-dark max-w-none"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
                // @ts-ignore
                code({ node, inline, className, children, ...props }) {
                    // @ts-ignore

                    const match = /language-(\w+)/.exec(className);

                    if (inline) {
                        return (
                            <code className={cn(
                                `relative rounded bg-muted px-[0.3rem] text-sm`,
                                `py-[0.2rem] font-mono text-sm font-semibol`,
                                className
                            )}
                                {...props}
                            >
                                <span> {children}</span>
                            </code>
                        )
                    }

                    if (!match) {
                        return (
                            <code
                                {...props}
                            >
                                {children}
                            </code>
                        )
                    }

                    return <CodeBlock
                        key={Math.random()}
                        language={match[1]}
                        value={String(children).replace(/\n$/, "")}
                        {...props}
                    />
                },
            }}
        >
            {content}
        </MemoizedReactMarkdown>
    )
}