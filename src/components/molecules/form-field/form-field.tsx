import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

type Control = {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
};

type FieldProps = {
  label: string;
  /** Shown under the control when the value is rejected. */
  error?: string | undefined;
  children: (control: Control) => ReactNode;
};

const control =
  "w-full rounded-md border bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground";

/** Label, control and error wired together; the control is rendered by the caller. */
function Field({ label, error, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

const borderOf = (error: string | undefined) => (error ? "border-foreground" : "border-border");

type InputFieldProps = Omit<ComponentPropsWithoutRef<"input">, "id"> &
  Pick<FieldProps, "label" | "error">;

export function InputField({ label, error, className, ...props }: InputFieldProps) {
  return (
    <Field label={label} error={error}>
      {(attributes) => (
        <input {...props} {...attributes} className={cn(control, borderOf(error), className)} />
      )}
    </Field>
  );
}

type TextAreaFieldProps = Omit<ComponentPropsWithoutRef<"textarea">, "id"> &
  Pick<FieldProps, "label" | "error">;

export function TextAreaField({ label, error, className, ...props }: TextAreaFieldProps) {
  return (
    <Field label={label} error={error}>
      {(attributes) => (
        <textarea
          rows={6}
          {...props}
          {...attributes}
          className={cn(control, borderOf(error), "resize-y", className)}
        />
      )}
    </Field>
  );
}
