export function getSiblings(element) {
  const children = [...element.parentElement.children];
  return children.filter((child) => child !== element);
}

export const createDomElement = (props) => {
  const element = document.createElement(props?.tagName || 'div');
  props?.className && (element.className = props.className);
  props?.innerText && (element.innerText = props.innerText);
  return element;
};
