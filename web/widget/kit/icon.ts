import DOMPurify from "dompurify";

type IconProps = {
  icon?: string | null;
  class?: string;
  onClick?: (event: PointerEvent) => void;
};

export function IconWidget({ icon, class: className, onClick }: IconProps) {
  let span = document.createElement("span");
  span.classList = `"milkdown-icon" ${className}`;
  span.onpointerdown = (event) => (onClick ? onClick(event) : null);
  if (icon) {
    span.innerHTML = DOMPurify.sanitize(icon.trim());
  }

  return span;
}
