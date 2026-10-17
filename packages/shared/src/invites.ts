import { z } from "zod";

export const inviteKindSchema = z.enum(["signup", "password-reset"]);
export type InviteKind = z.infer<typeof inviteKindSchema>;

export const createInviteSchema = z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("signup") }),
    z.object({ kind: z.literal("password-reset"), userId: z.string() }),
]);
export type CreateInviteInput = z.infer<typeof createInviteSchema>;

export interface CreatedInvite {
    /** Shown once; only its hash is stored. */
    token: string;
    expiresAt: string;
}

export interface InviteInfo {
    kind: InviteKind;
    /** Set for password resets. */
    username: string | null;
}

export const usernameSchema = z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/)
    .transform((value) => value.toLowerCase());

export const passwordSchema = z.string().min(8).max(128);

export const acceptInviteSchema = z.object({
    /** Required for signup invites, ignored for password resets. */
    username: usernameSchema.optional(),
    password: passwordSchema,
});
export type AcceptInviteInput = z.input<typeof acceptInviteSchema>;
