import { OppEntity } from "../../types";

export default function attributeClassNames(
  stateObj: OppEntity,
  attributes: string[]
): string {
  if (!stateObj) {
    return "";
  }
  return attributes
    .map((attribute) =>
      attribute in stateObj.attributes ? "has-" + attribute : ""
    )
    .filter((attr) => attr !== "")
    .join(" ");
}
