import { CircleAlert } from "lucide-react";
import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";
import { Icon } from "@/components/atoms/icon";
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
  /** Decorative detail under the control, such as a character count. */
  hint?: ReactNode;
  children: (control: Control) => ReactNode;
};

const control =
  "w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-xl text-foreground placeholder:text-muted-foreground";

/** Rule at least 3:1 against the page; an error thickens it so it never relies on colour. */
const borderOf = (error: string | undefined) =>
  error ? "border-b-2 border-foreground" : "border-muted-foreground";

/** Label, control and error wired together; the control is rendered by the caller. */
function Field({ label, error, hint, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-sm tracking-widest uppercase">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="flex items-start gap-2 text-sm font-medium">
          <Icon icon={CircleAlert} size="sm" className="mt-0.5" />
          {error}
        </p>
      )}
      {hint && (
        <p
          aria-hidden="true"
          className="text-right font-mono text-xs text-muted-foreground tabular-nums"
        >
          {hint}
        </p>
      )}
    </div>
  );
}

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
  Pick<FieldProps, "label" | "error" | "hint">;

export function TextAreaField({ label, error, hint, className, ...props }: TextAreaFieldProps) {
  return (
    <Field label={label} error={error} hint={hint}>
      {(attributes) => (
        <textarea
          rows={6}
          {...props}
          {...attributes}
          className={cn(control, borderOf(error), "resize-none", className)}
        />
      )}
    </Field>
  );
}
