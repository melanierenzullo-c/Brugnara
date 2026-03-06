import { convexTest } from "convex-test";
import { describe, expect, it, vi } from "vitest";

import schema from "./schema";
import { api } from "./_generated/api";
import { modules } from "./test.setup";

describe("misc coverage: clearProducts/files/oeffnungszeiten/bootstrap/users", () => {
  it("covers clearProducts delete loop", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    const asAdmin = t.withIdentity({
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    });
    await asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {});

    const kategorieId = await t.run(async (ctx) => {
      return await ctx.db.insert("kategorien", {
        name: "Kategorie",
        nameIt: "Categoria",
        slug: "kategorie",
      });
    });
    const storageId = await t.run(async (ctx) => {
      const blob = new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" });
      return await ctx.storage.store(blob);
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("produkte", {
        name: "P",
        beschreibung: "B",
        foto: storageId,
        nameIt: "P",
        beschreibungIt: "B",
        kategorieId,
        slug: "p",
      });
    });

    const result = await asAdmin.mutation(api.clearProducts.clearProducts, {});
    expect(result).toMatch(/Deleted 1 products/);

    const remaining = await t.run(async (ctx) => {
      return await ctx.db.query("produkte").collect();
    });
    expect(remaining).toHaveLength(0);
  });

  it("covers oeffnungszeiten insert and patch branches", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    const asAdmin = t.withIdentity({
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    });
    await asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {});

    await asAdmin.mutation(api.oeffnungszeiten.update, {
      tag: "Mo",
      von1: "08:00",
      bis1: "12:00",
      von2: "14:00",
      bis2: "18:00",
      geschlossen: false,
    });

    await asAdmin.mutation(api.oeffnungszeiten.update, {
      tag: "Mo",
      von1: "09:00",
      bis1: "12:30",
      von2: "14:30",
      bis2: "18:30",
      geschlossen: false,
    });

    const doc = await t.run(async (ctx) => {
      return await ctx.db
        .query("oeffnungszeiten")
        .withIndex("by_tag", (q) => q.eq("tag", "Mo"))
        .unique();
    });
    expect(doc).toMatchObject({ tag: "Mo", von1: "09:00", bis2: "18:30" });
  });

  it("covers files.getImageUrl query", async () => {
    const t = convexTest(schema, modules);

    const storageId = await t.run(async (ctx) => {
      const blob = new Blob([new Uint8Array([4, 5, 6])], { type: "image/png" });
      return await ctx.storage.store(blob);
    });

    const url = await t.query(api.files.getImageUrl, { storageId });
    expect(url === null || typeof url === "string").toBe(true);
  });

  it("covers bootstrap error paths", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    await expect(t.mutation(api.bootstrap.bootstrapInitialAdmin, {})).rejects.toThrowError(
      /Not authenticated/i
    );

    const asNoEmail = t.withIdentity({ subject: "sub_x", name: "X" });
    await expect(
      asNoEmail.mutation(api.bootstrap.bootstrapInitialAdmin, {})
    ).rejects.toThrowError(/no email/i);
  });

  it("covers acceptInvite error paths (invalid/mismatch/expired)", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    const asAdmin = t.withIdentity({
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    });
    await asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {});

    await expect(
      t.withIdentity({ subject: "sub_emp", email: "emp@example.com" }).mutation(
        api.users.acceptInvite,
        { token: "not-a-real-token" }
      )
    ).rejects.toThrowError(/Invalid invite/i);

    const invite = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "employee@example.com",
    });

    await expect(
      t.withIdentity({
        subject: "sub_other",
        email: "other@example.com",
        name: "Other",
      }).mutation(api.users.acceptInvite, { token: invite.token })
    ).rejects.toThrowError(/does not match/i);

    const now = Date.now();
    const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(now);
    const invite2 = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "expired@example.com",
    });

    await t.run(async (ctx) => {
      const tokenHash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(invite2.token)
      );
      const tokenHashHex = Array.from(new Uint8Array(tokenHash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const doc = await ctx.db
        .query("invites")
        .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHashHex))
        .unique();
      if (!doc) throw new Error("invite not found");
      await ctx.db.patch(doc._id, { expiresAt: now - 1 });
    });

    dateNowSpy.mockReturnValue(now + 2);
    await expect(
      t.withIdentity({
        subject: "sub_expired",
        email: "expired@example.com",
        name: "Expired",
      }).mutation(api.users.acceptInvite, { token: invite2.token })
    ).rejects.toThrowError(/expired/i);

    dateNowSpy.mockRestore();
  });

  it("covers additional users.ts branches", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    const asAdmin = t.withIdentity({
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    });
    await asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {});

    await expect(
      asAdmin.mutation(api.users.createEmployeeInvite, { email: "   " })
    ).rejects.toThrowError(/email required/i);

    // Provision an existing user and assert duplicate invite is rejected.
    const invite = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "employee@example.com",
    });
    const asEmployee = t.withIdentity({
      subject: "sub_employee",
      email: "employee@example.com",
      name: "Employee",
    });
    await asEmployee.mutation(api.users.acceptInvite, { token: invite.token });

    await expect(
      asAdmin.mutation(api.users.createEmployeeInvite, {
        email: "employee@example.com",
      })
    ).rejects.toThrowError(/already exists/i);

    await expect(
      asEmployee.mutation(api.users.acceptInvite, { token: "   " })
    ).rejects.toThrowError(/token required/i);

    // Valid token but no email in identity.
    const invite2 = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "noemail@example.com",
    });
    await expect(
      t.withIdentity({ subject: "sub_noemail", name: "NoEmail" }).mutation(
        api.users.acceptInvite,
        { token: invite2.token }
      )
    ).rejects.toThrowError(/no email/i);

    // Create a new invite manually to hit "User already provisioned".
    const invite3 = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "employee2@example.com",
    });
    const asEmployee2 = t.withIdentity({
      subject: "sub_employee2",
      email: "employee2@example.com",
      name: "Employee2",
    });
    await asEmployee2.mutation(api.users.acceptInvite, { token: invite3.token });

    const invite4Token = await t.run(async (ctx) => {
      const token = "manual-token";
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(token)
      );
      const tokenHash = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const now = Date.now();
      await ctx.db.insert("invites", {
        email: "employee2@example.com",
        role: "employee",
        tokenHash,
        expiresAt: now + 1000,
        createdAt: now,
        createdByUserId: (await ctx.db.query("users").first())?._id,
      });
      return token;
    });

    await expect(
      asEmployee2.mutation(api.users.acceptInvite, { token: invite4Token })
    ).rejects.toThrowError(/already provisioned/i);
  });
});

