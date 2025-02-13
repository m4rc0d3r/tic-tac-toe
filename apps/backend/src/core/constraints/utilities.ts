import type { TupleToUnion } from "type-fest";

type ConstrainedField = string;
type ConstrainedFields<T extends ConstrainedField = ConstrainedField> = [T, ...T[]];
type FieldsInConstraints<T extends ConstrainedField = ConstrainedField> = [
  ConstrainedFields<T>,
  ...ConstrainedFields<T>[],
];
function isConstrainedFields<T extends FieldsInConstraints>(
  fields: string[],
  fieldsInConstraints: T,
): fields is TupleToUnion<T> {
  outer: for (const constrainedFields of fieldsInConstraints) {
    if (fields.length !== constrainedFields.length) {
      continue;
    }
    const sortedFields = fields.toSorted();
    const sortedConstrainedFields = constrainedFields.toSorted();
    for (let i = 0; i < sortedConstrainedFields.length; ++i) {
      if (sortedFields.at(i) !== sortedConstrainedFields.at(i)) {
        continue outer;
      }
    }
    return true;
  }
  return false;
}

export { isConstrainedFields };
