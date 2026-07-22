import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableScrollArea,
} from "./index";
import { DemoFrame } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Simple table"
        description="Table should show the component plainly as tabular structure."
      >
        <TableScrollArea aria-labelledby="token-table-caption">
          <Table>
            <TableCaption id="token-table-caption">Design token usage</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableHead scope="row">color.brand</TableHead>
                <TableCell>color</TableCell>
                <TableCell>Buttons, accents</TableCell>
              </TableRow>
              <TableRow>
                <TableHead scope="row">spacing.base</TableHead>
                <TableCell>length</TableCell>
                <TableCell>Layout scale</TableCell>
              </TableRow>
              <TableRow>
                <TableHead scope="row">radius.base</TableHead>
                <TableCell>length</TableCell>
                <TableCell>Surface shape</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableScrollArea>
      </DemoFrame>
    </>
  );
}
