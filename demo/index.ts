import { TreeSelect, TreeNode } from "../src/index";

// Sample data for different tree examples
const sampleData: TreeNode[] = [
  {
    id: "1",
    label: "Root",
    children: [
      {
        id: "2",
        label: "Documents",
        children: [
          { id: "3", label: "Work" },
          { id: "4", label: "Personal" },
        ],
      },
      {
        id: "5",
        label: "Pictures",
        children: [
          { id: "6", label: "Vacation" },
          { id: "7", label: "Family" },
        ],
      },
    ],
  },
];

// Basic tree implementation
function createBasicTree(container: HTMLElement) {
  const treeSelect = new TreeSelect(sampleData);

  function renderTreeNode(node: TreeNode, container: HTMLElement) {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";

    const contentDiv = document.createElement("div");
    contentDiv.className = "tree-node-content";

    const labelSpan = document.createElement("span");
    labelSpan.className = "tree-node-label";
    labelSpan.textContent = node.label;

    contentDiv.appendChild(labelSpan);

    if (node.children && node.children.length > 0) {
      const toggle = document.createElement("div");
      toggle.className = "tree-node-toggle";
      toggle.onclick = (e) => {
        e.stopPropagation();
        toggle.classList.toggle("expanded");
        childrenContainer.style.display =
          childrenContainer.style.display === "none" ? "block" : "none";
      };
      contentDiv.insertBefore(toggle, labelSpan);

      const childrenContainer = document.createElement("div");
      childrenContainer.className = "tree-node-children";
      node.children.forEach((child) =>
        renderTreeNode(child, childrenContainer)
      );
      nodeDiv.appendChild(childrenContainer);
    }

    contentDiv.onclick = () => {
      contentDiv.parentElement?.classList.toggle("selected");
      console.log("Selected node:", node);
    };

    nodeDiv.appendChild(contentDiv);
    container.appendChild(nodeDiv);
  }

  treeSelect.getNodes().forEach((node) => renderTreeNode(node, container));
}

// Checkbox tree implementation
function createCheckboxTree(container: HTMLElement) {
  const treeSelect = new TreeSelect(sampleData);

  function renderTreeNode(node: TreeNode, container: HTMLElement) {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";

    const contentDiv = document.createElement("div");
    contentDiv.className = "tree-node-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "tree-node-checkbox";
    checkbox.onchange = (e) => {
      e.stopPropagation();
      console.log("Checkbox changed:", node, checkbox.checked);
    };

    const labelSpan = document.createElement("span");
    labelSpan.className = "tree-node-label";
    labelSpan.textContent = node.label;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(labelSpan);

    if (node.children && node.children.length > 0) {
      const toggle = document.createElement("div");
      toggle.className = "tree-node-toggle";
      toggle.onclick = (e) => {
        e.stopPropagation();
        toggle.classList.toggle("expanded");
        childrenContainer.style.display =
          childrenContainer.style.display === "none" ? "block" : "none";
      };
      contentDiv.insertBefore(toggle, checkbox);

      const childrenContainer = document.createElement("div");
      childrenContainer.className = "tree-node-children";
      node.children.forEach((child) =>
        renderTreeNode(child, childrenContainer)
      );
      nodeDiv.appendChild(childrenContainer);
    }

    contentDiv.onclick = () => {
      contentDiv.parentElement?.classList.toggle("selected");
      console.log("Selected node:", node);
    };

    nodeDiv.appendChild(contentDiv);
    container.appendChild(nodeDiv);
  }

  treeSelect.getNodes().forEach((node) => renderTreeNode(node, container));
}

// Custom styled tree implementation
function createCustomTree(container: HTMLElement) {
  const treeSelect = new TreeSelect(sampleData);

  function renderTreeNode(node: TreeNode, container: HTMLElement) {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";

    const contentDiv = document.createElement("div");
    contentDiv.className = "tree-node-content";
    contentDiv.style.backgroundColor =
      node.id === "1" ? "#f0f7ff" : "transparent";

    const labelSpan = document.createElement("span");
    labelSpan.className = "tree-node-label";
    labelSpan.textContent = node.label;
    labelSpan.style.fontWeight = node.children ? "bold" : "normal";

    contentDiv.appendChild(labelSpan);

    if (node.children && node.children.length > 0) {
      const toggle = document.createElement("div");
      toggle.className = "tree-node-toggle";
      toggle.onclick = (e) => {
        e.stopPropagation();
        toggle.classList.toggle("expanded");
        childrenContainer.style.display =
          childrenContainer.style.display === "none" ? "block" : "none";
      };
      contentDiv.insertBefore(toggle, labelSpan);

      const childrenContainer = document.createElement("div");
      childrenContainer.className = "tree-node-children";
      node.children.forEach((child) =>
        renderTreeNode(child, childrenContainer)
      );
      nodeDiv.appendChild(childrenContainer);
    }

    contentDiv.onclick = () => {
      contentDiv.parentElement?.classList.toggle("selected");
      console.log("Selected node:", node);
    };

    nodeDiv.appendChild(contentDiv);
    container.appendChild(nodeDiv);
  }

  treeSelect.getNodes().forEach((node) => renderTreeNode(node, container));
}

// Initialize all tree examples
const basicTreeContainer = document.getElementById("basic-tree");
const checkboxTreeContainer = document.getElementById("checkbox-tree");
const customTreeContainer = document.getElementById("custom-tree");

if (basicTreeContainer) createBasicTree(basicTreeContainer);
if (checkboxTreeContainer) createCheckboxTree(checkboxTreeContainer);
if (customTreeContainer) createCustomTree(customTreeContainer);
