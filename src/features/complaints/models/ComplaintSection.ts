import { ComplaintField } from "./ComplaintField";

export interface ComplaintSection {
  code: string;

  title: string;

  required?: boolean;

  fields: ComplaintField[];
}