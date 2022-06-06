import {
  LteMButtonClickType,
  LteMButtonClickTypeName,
} from "../interfaces/LteMButton";
import { FamilyRole } from "../interfaces/FamilyRole";

export class Dad implements FamilyRole {
  readonly clickType: LteMButtonClickType;
  readonly clickTypeName: LteMButtonClickTypeName;
  readonly role: string;
  readonly kvName: string;

  constructor() {
    this.clickType = 3;
    this.clickTypeName = "LONG";
    this.role = "Dad";
    this.kvName = "LAST_DRY_DATE_DAD";
  }
}
