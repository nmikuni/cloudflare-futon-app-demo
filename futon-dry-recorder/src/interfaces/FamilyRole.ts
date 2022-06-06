import { LteMButtonClickType, LteMButtonClickTypeName } from "./LteMButton";

export interface FamilyRole {
  readonly clickType: LteMButtonClickType;
  readonly clickTypeName: LteMButtonClickTypeName;
  readonly role: string;
  readonly kvName: string;
}
