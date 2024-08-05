import { OutputBlockData } from "@editorjs/editorjs";
import { TableBlockProps } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TableBlockConponentProps = {
    block: OutputBlockData<string, TableBlockProps>;
}


const TableBlock: React.FC<TableBlockConponentProps> = ({ block }) => {
    const data = block.data.content.slice();
    const headers = block.data.withHeadings ? data.shift() : null;
    return (
        <Table>
            {headers && (
                <TableHeader>
                    <TableRow className="hover:bg-gray-100">
                        {headers.map((header, index) => (
                            <TableHead key={index}>
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
            )}

            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                        {row.map((cell, rowIdx) => (
                            <TableCell key={rowIdx}>{cell}</TableCell>
                        ))}
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    )
}


export default TableBlock;