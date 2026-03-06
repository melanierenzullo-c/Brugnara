import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import schema from "./schema";
import { api } from "./_generated/api";
import { modules } from "./test.setup";

describe("produkte + files auth", () => {
  it("requires provisioning for upload URL", async () => {
    const t = convexTest(schema, modules);

    await expect(t.mutation(api.files.generateUploadUrl, {})).rejects.toThrowError(
      /Not authenticated/i
    );

    const asUser = t.withIdentity({
      subject: "sub_user",
      email: "user@example.com",
      name: "User",
    });
    await expect(
      asUser.mutation(api.files.generateUploadUrl, {})
    ).rejects.toThrowError(/User not provisioned/i);
  });

  it("allows provisioned employee to create a product", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    const asAdmin = t.withIdentity({
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    });
    await asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {});

    const invite = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "employee@example.com",
    });
    const asEmployee = t.withIdentity({
      subject: "sub_employee",
      email: "employee@example.com",
      name: "Employee",
    });
    await asEmployee.mutation(api.users.acceptInvite, { token: invite.token });

    const uploadUrl = await asEmployee.mutation(api.files.generateUploadUrl, {});
    expect(typeof uploadUrl).toBe("string");

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

    const createdId = await asEmployee.mutation(api.produkte.create, {
      name: "Hammer",
      beschreibung: "Beschreibung",
      foto: storageId,
      nameIt: "Martello",
      beschreibungIt: "Descrizione",
      kategorieId,
      slug: "hammer",
    });

    expect(typeof createdId).toBe("string");

    const list = await t.query(api.produkte.listByKategorie, { kategorieId });
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({
      _id: createdId,
      slug: "hammer",
    });
    expect(list[0]).toHaveProperty("imageUrl");

    await expect(
      asEmployee.mutation(api.produkte.create, {
        name: "X",
        beschreibung: "Y",
        foto: storageId,
        nameIt: "X",
        beschreibungIt: "Y",
        kategorieId,
        slug: "   ",
      })
    ).rejects.toThrowError(/slug required/i);
  });
});

