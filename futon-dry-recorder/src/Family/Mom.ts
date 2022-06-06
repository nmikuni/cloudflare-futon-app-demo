import {
  LteMButtonClickType,
  LteMButtonClickTypeName,
} from "../interfaces/LteMButton";
import { FamilyRole } from "../interfaces/FamilyRole";

export class Mom implements FamilyRole {
  readonly clickType: LteMButtonClickType;
  readonly clickTypeName: LteMButtonClickTypeName;
  readonly role: string;
  readonly kvName: string;

  constructor() {
    this.clickType = 2;
    this.clickTypeName = "DOUBLE";
    this.role = "Mom";
    this.kvName = "LAST_DRY_DATE_MOM";
  }
}
