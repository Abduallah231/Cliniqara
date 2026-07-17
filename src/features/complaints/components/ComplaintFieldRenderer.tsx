import TextField from "./fields/TextField";
import TextAreaField from "./fields/TextAreaField";
import NumberField from "./fields/NumberField";
import IntegerField from "./fields/IntegerField";
import DecimalField from "./fields/DecimalField";
import SingleSelectField from "./fields/SingleSelectField";
import MultiSelectField from "./fields/MultiSelectField";
import BooleanField from "./fields/BooleanField";
import SeverityField from "./fields/SeverityField";

import { ComplaintField } from "../models/ComplaintField";
import { FieldType } from "../models/FieldType";

type Props = {
  field: ComplaintField;
  value: any;
  onChange: (value: any) => void;
};

export default function ComplaintFieldRenderer({
  field,
  value,
  onChange,
}: Props) {
  switch (field.type) {
    case FieldType.TEXT:
      return (
        <TextField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.TEXTAREA:
      return (
        <TextAreaField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.NUMBER:
      return (
        <NumberField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.INTEGER:
      return (
        <IntegerField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.DECIMAL:
      return (
        <DecimalField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.SINGLE_SELECT:
      return (
        <SingleSelectField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.MULTI_SELECT:
      return (
        <MultiSelectField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.BOOLEAN:
      return (
        <BooleanField
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case FieldType.SEVERITY:
      return (
        <SeverityField
          value={value}
          onChange={onChange}
        />
      );

    default:
      return null;
  }
}