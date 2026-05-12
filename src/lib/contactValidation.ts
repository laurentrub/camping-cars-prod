// Helpers to enforce double-entry confirmation of email & phone on public forms.

const normEmail = (v: string) => v.trim().toLowerCase();
const normPhone = (v: string) => v.replace(/[\s().\-_/]/g, "").replace(/^00/, "+");

export function validateConfirmedContact(opts: {
  email: string;
  emailConfirm: string;
  phone?: string;
  phoneConfirm?: string;
  phoneRequired?: boolean;
}): string | null {
  if (!opts.email || !opts.emailConfirm) return "Veuillez confirmer votre email";
  if (normEmail(opts.email) !== normEmail(opts.emailConfirm)) {
    return "Les deux emails saisis ne correspondent pas";
  }
  const phone = opts.phone ?? "";
  const phoneConfirm = opts.phoneConfirm ?? "";
  if (opts.phoneRequired && !phone.trim()) return "Téléphone requis";
  if (phone.trim() || phoneConfirm.trim()) {
    if (!phone.trim() || !phoneConfirm.trim()) return "Veuillez confirmer votre numéro de téléphone";
    if (normPhone(phone) !== normPhone(phoneConfirm)) return "Les deux numéros saisis ne correspondent pas";
  }
  return null;
}

// Prevent paste on confirmation fields to force the user to retype.
export const noPasteProps = {
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  },
  onDrop: (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  },
  autoComplete: "off" as const,
};
