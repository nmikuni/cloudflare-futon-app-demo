import {
  LteMButtonClickType,
  LteMButtonClickTypeName,
} from "../interfaces/LteMButton";
import { FamilyRole } from "../interfaces/FamilyRole";

export class Kid implements FamilyRole {
  readonly clickType: LteMButtonClickType;
  readonly clickTypeName: LteMButtonClickTypeName;
  readonly role: string;
  readonly kvName: string;

  constructor() {
    this.clickType = 1;
    this.clickTypeName = "SINGLE";
    this.role = "Kid";
    this.kvName = "LAST_DRY_DATE_KID";
  }
}
