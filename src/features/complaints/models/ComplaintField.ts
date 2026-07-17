import { FieldType } from "./FieldType";
import { ComplaintOption } from "./ComplaintOption";

export interface ComplaintField {
  code: string;
  label: string;

  type: FieldType;

  required: boolean;

  allowMultiple?: boolean;

  placeholder?: string;

  options?: ComplaintOption[];
}