export interface LteMButtonPayload {
  clickType: LteMButtonClickType;
  clickTypeName: LteMButtonClickTypeName;
  batteryLevel: number;
  binaryParserEnabled: boolean;
}

export type LteMButtonClickType = 1 | 2 | 3;
export type LteMButtonClickTypeName = "SINGLE" | "DOUBLE" | "LONG";
