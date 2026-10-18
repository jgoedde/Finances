import { z } from "zod";

/**
 * A link is either an invite (signup) or a password reset link.
 */
export const linkKindSchema = z.enum(["invite", "password-reset"]);
export type LinkKind = z.infer<typeof linkKindSchema>;

export const createPasswordResetLinkSchema = z.object({ userId: z.string() });

export interface CreatedLink {
    /**
     * Shown once; only its hash is stored.
     */
    token: string;
    expiresAt: string;
}

export interface LinkInfo {
    kind: LinkKind;
    /**
     * Set for password reset links.
     */
    username: string | null;
}

const usernameSchema = z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/)
    .transform((value) => value.toLowerCase());

const passwordSchema = z.string().min(8).max(128);

export const redeemLinkSchema = z.object({
    /**
     * Required for invites, ignored for password reset links.
     */
    username: usernameSchema.optional(),
    password: passwordSchema,
});
export type RedeemLinkInput = z.input<typeof redeemLinkSchema>;
