import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ContactState } from "@/lib/contact";
import en from "../../../../messages/en.json";
import { ContactForm } from "./contact-form";

const messages = en.home.contact.form;

function setup(result: ContactState, { keyed = true } = {}) {
  const action = vi.fn().mockResolvedValue(result);
  render(
    <ContactForm
      messages={messages}
      action={action}
      siteKey={keyed ? "site-key" : undefined}
      challengeAction="contact"
    />,
  );
  return action;
}

async function fill(name = "Ada", email = "ada@example.com", text = "Hello, I like your work.") {
  if (name) await userEvent.type(screen.getByLabelText(messages.name), name);
  if (email) await userEvent.type(screen.getByLabelText(messages.email), email);
  if (text) await userEvent.type(screen.getByLabelText(messages.message), text);
}

const send = () => userEvent.click(screen.getByRole("button", { name: messages.submit }));

describe("ContactForm", () => {
  it("says the form is unavailable when there is no Turnstile site key", () => {
    setup({ status: "sent" }, { keyed: false });

    expect(screen.getByText(messages.unconfigured)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: messages.submit })).not.toBeInTheDocument();
  });

  it("labels every field and hides the honeypot from assistive technology", () => {
    setup({ status: "sent" });

    expect(screen.getByLabelText(messages.name)).toBeRequired();
    expect(screen.getByLabelText(messages.email)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(messages.message)).toBeRequired();
    expect(document.querySelector('input[name="website"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("counts the characters of the message", async () => {
    setup({ status: "sent" });

    await userEvent.type(screen.getByLabelText(messages.message), "Hello");

    expect(screen.getByText("5 / 4000")).toBeInTheDocument();
  });

  it("flags each invalid field, focuses the first one and does not call the server", async () => {
    const action = setup({ status: "sent" });

    await fill("Ada", "not-an-email", "short");
    await send();

    const email = screen.getByLabelText(messages.email);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription(messages.errors.email);
    expect(screen.getByLabelText(messages.message)).toHaveAccessibleDescription(
      messages.errors.message,
    );
    expect(screen.getByLabelText(messages.name)).not.toHaveAttribute("aria-invalid");
    expect(email).toHaveFocus();
    expect(action).not.toHaveBeenCalled();
  });

  it("clears a field's error once the visitor edits it", async () => {
    setup({ status: "sent" });
    await fill("", "bad", "");
    await send();
    const email = screen.getByLabelText(messages.email);

    await userEvent.type(email, "x");

    expect(email).not.toHaveAttribute("aria-invalid");
  });

  it("replaces the form with a confirmation after a successful send", async () => {
    const action = setup({ status: "sent" });

    await fill();
    await send();

    expect(await screen.findByRole("status")).toHaveTextContent(messages.confirmation.title);
    expect(screen.getByRole("status")).toHaveFocus();
    expect(screen.queryByLabelText(messages.name)).not.toBeInTheDocument();
    const data = action.mock.calls[0]?.[1] as FormData;
    expect(data.get("name")).toBe("Ada");
    expect(data.get("website")).toBe("");
  });

  it("offers a clean form again from the confirmation", async () => {
    setup({ status: "sent" });
    await fill();
    await send();

    await userEvent.click(await screen.findByRole("button", { name: messages.confirmation.again }));

    expect(screen.getByLabelText(messages.name)).toHaveValue("");
  });

  it("keeps what was typed and announces an unavailable or human-check failure", async () => {
    setup({ status: "error", reason: "unavailable" });

    await fill();
    await send();

    expect(await screen.findByRole("alert")).toHaveTextContent(messages.unavailable);
    expect(screen.getByLabelText(messages.name)).toHaveValue("Ada");
  });

  it("highlights the fields the server rejected", async () => {
    setup({ status: "error", reason: "invalid", fields: ["message"] });

    await fill("Ada", "ada@example.com", "A valid message from me.");
    await send();

    await waitFor(() =>
      expect(screen.getByLabelText(messages.message)).toHaveAttribute("aria-invalid", "true"),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(messages.invalid);
  });
});
