import iconSetContent from "../../build/opp-icons.html";

const documentContainer = document.createElement("template");
documentContainer.setAttribute("style", "display: none;");
documentContainer.innerHTML = iconSetContent;
document.head.appendChild(documentContainer.content);
