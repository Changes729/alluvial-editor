import { IconWidget } from "./icon";

interface BlockHandleProps {
  onAdd: () => void;
  addIcon: string;
  handleIcon: string;
}

export function BlockHandlerWidget(props: BlockHandleProps) {
  let fragment = document.createDocumentFragment();
  let operation_add = document.createElement("div");
  let operation_handle = document.createElement("div");

  operation_add.className = "operation-item";
  operation_add.onpointerdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    operation_add.classList.add("active");
  };
  operation_add.onpointerup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    operation_add.classList.add("active");
    props.onAdd();
  };

  operation_add.appendChild(IconWidget({ icon: props.addIcon }));

  operation_handle.className = "operation-item";
  operation_add.appendChild(IconWidget({ icon: props.handleIcon }));

  fragment.append(operation_add, operation_handle);

  return fragment;
}
