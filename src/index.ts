export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export class TreeSelect {
  private nodes: TreeNode[];

  constructor(nodes: TreeNode[]) {
    this.nodes = nodes;
  }

  public getNodes(): TreeNode[] {
    return this.nodes;
  }
}
