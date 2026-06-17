# Task_Manager


## Parsing
Parsing is the process where the browser reads HTML and CSS code and understands their structure. It converts the code into a format that the browser can work with.

## Tokenization
Tokenization is the first step of parsing. The browser breaks the code into small pieces called tokens, such as tags, attributes, text, and symbols.

## DOM Tree
The DOM (Document Object Model) Tree is a tree-like structure created from HTML. Every HTML element becomes a node in the tree, allowing JavaScript to access and modify webpage content.

## CSSOM Tree
The CSSOM (CSS Object Model) Tree is created from CSS rules. It contains all styling information that will be applied to the HTML elements.

## Render Tree
The Render Tree is created by combining the DOM Tree and CSSOM Tree. It contains only the elements that need to be displayed on the screen along with their styles.

## Event Bubbling
Event Bubbling is an event propagation method where an event starts from the target element and moves upward through its parent elements.

**Example:** Clicking a button inside a div triggers the button's event first, then the div's event.

## Event Capturing
Event Capturing is the opposite of bubbling. The event starts from the top-level ancestor and moves down to the target element.

**Example:** The document receives the event first, followed by parent elements, and finally the clicked element.

## Event Delegation
Event Delegation is a technique where a parent element handles events for its child elements using event bubbling. Instead of adding event listeners to multiple child elements, a single listener is added to the parent.
