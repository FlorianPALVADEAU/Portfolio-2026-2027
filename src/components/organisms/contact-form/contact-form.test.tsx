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

describe("ContactForm", () => {
  it("renders nothing without a Turnstile site key", () => {
    setup({ status: "sent" }, { keyed: false });

    expect(screen.queryByRole("button", { name: messages.submit })).not.toBeInTheDocument();
  });

  it("labels every field and hides the honeypot from assistive technology", () => {
    setup({ status: "sent" });

    expect(screen.getByLabelText(messages.name)).toBeRequired();
    expect(screen.getByLabelText(messages.email)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(messages.message)).toBeRequired();
    expect(
      document.querySelector('input[name="website"]')?.closest("[aria-hidden]"),
    ).not.toBeNull();
  });

  it("submits the fields and announces success", async () => {
    const action = setup({ status: "sent" });

    await userEvent.type(screen.getByLabelText(messages.name), "Ada");
    await userEvent.type(screen.getByLabelText(messages.email), "ada@example.com");
    await userEvent.type(screen.getByLabelText(messages.message), "Hello, I like your work.");
    await userEvent.click(screen.getByRole("button", { name: messages.submit }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(messages.sent));
    const data = action.mock.calls[0]?.[1] as FormData;
    expect(data.get("name")).toBe("Ada");
    expect(data.get("website")).toBe("");
  });

  it.each(["invalid", "human", "unavailable"] as const)(
    "announces the %s failure",
    async (reason) => {
      setup({ status: "error", reason });

      await userEvent.type(screen.getByLabelText(messages.name), "Ada");
      await userEvent.type(screen.getByLabelText(messages.email), "ada@example.com");
      await userEvent.type(screen.getByLabelText(messages.message), "Hello, I like your work.");
      await userEvent.click(screen.getByRole("button", { name: messages.submit }));

      await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(messages[reason]));
    },
  );
});
