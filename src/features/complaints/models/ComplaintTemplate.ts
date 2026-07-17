import { ComplaintSection } from "./ComplaintSection";

export interface ComplaintTemplate {
  code: string;

  title: string;

  version: number;

  sections: ComplaintSection[];
}