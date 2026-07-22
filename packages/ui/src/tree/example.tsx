import { DemoFrame } from '../example-theme/demo'
import {
  Tree,
  TreeBranch,
  TreeBranchContent,
  TreeBranchTrigger,
  TreeGroup,
  TreeItem,
} from './index'

export default function Example() {
  return (
    <DemoFrame
      title="Tree"
      description="A semantic nested list uses native disclosure behavior without claiming a composite tree model."
    >
      <Tree aria-label="Package explorer">
        <TreeGroup>
          <TreeBranch open>
            <TreeBranchTrigger>tokens</TreeBranchTrigger>
            <TreeBranchContent>
              <TreeBranch open>
                <TreeBranchTrigger>color</TreeBranchTrigger>
                <TreeBranchContent>
                  <TreeItem>brand</TreeItem>
                  <TreeItem>background</TreeItem>
                  <TreeItem>foreground</TreeItem>
                </TreeBranchContent>
              </TreeBranch>
              <TreeBranch>
                <TreeBranchTrigger>spacing</TreeBranchTrigger>
                <TreeBranchContent>
                  <TreeItem>base</TreeItem>
                  <TreeItem>small</TreeItem>
                  <TreeItem>large</TreeItem>
                </TreeBranchContent>
              </TreeBranch>
            </TreeBranchContent>
          </TreeBranch>
          <TreeBranch>
            <TreeBranchTrigger>components</TreeBranchTrigger>
            <TreeBranchContent>
              <TreeItem>button</TreeItem>
              <TreeItem>card</TreeItem>
              <TreeItem>dialog</TreeItem>
            </TreeBranchContent>
          </TreeBranch>
        </TreeGroup>
      </Tree>
    </DemoFrame>
  )
}
