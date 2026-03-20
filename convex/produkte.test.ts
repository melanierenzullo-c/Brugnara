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

  it("allows employee to update a product", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    const asAdmin = t.withIdentity({
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    });
    await asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {});

    const invite = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "emp@example.com",
    });
    const asEmployee = t.withIdentity({
      subject: "sub_emp",
      email: "emp@example.com",
      name: "Emp",
    });
    await asEmployee.mutation(api.users.acceptInvite, { token: invite.token });

    const kategorieId = await t.run(async (ctx) => {
      return await ctx.db.insert("kategorien", {
        name: "Wein",
        nameIt: "Vino",
        slug: "wein",
      });
    });

    const storageId = await t.run(async (ctx) => {
      const blob = new Blob([new Uint8Array([1])], { type: "image/png" });
      return await ctx.storage.store(blob);
    });

    const id = await asEmployee.mutation(api.produkte.create, {
      name: "Alt",
      beschreibung: "Altes Produkt",
      foto: storageId,
      nameIt: "Vecchio",
      beschreibungIt: "Prodotto vecchio",
      kategorieId,
      slug: "alt",
    });

    await asEmployee.mutation(api.produkte.update, {
      id,
      name: "Neu",
      beschreibung: "Neues Produkt",
      nameIt: "Nuovo",
      beschreibungIt: "Prodotto nuovo",
      kategorieId,
      slug: "neu",
    });

    const list = await t.query(api.produkte.listByKategorie, { kategorieId });
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ name: "Neu", slug: "neu", nameIt: "Nuovo" });
  });

  it("allows employee to delete a product", async () => {
    const t = convexTest(schema, modules);

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    const asAdmin = t.withIdentity({
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    });
    await asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {});

    const invite = await asAdmin.mutation(api.users.createEmployeeInvite, {
      email: "emp2@example.com",
    });
    const asEmployee = t.withIdentity({
      subject: "sub_emp2",
      email: "emp2@example.com",
      name: "Emp2",
    });
    await asEmployee.mutation(api.users.acceptInvite, { token: invite.token });

    const kategorieId = await t.run(async (ctx) => {
      return await ctx.db.insert("kategorien", {
        name: "Bier",
        nameIt: "Birra",
        slug: "bier",
      });
    });

    const storageId = await t.run(async (ctx) => {
      const blob = new Blob([new Uint8Array([1])], { type: "image/png" });
      return await ctx.storage.store(blob);
    });

    const id = await asEmployee.mutation(api.produkte.create, {
      name: "Lager",
      beschreibung: "Ein Bier",
      foto: storageId,
      nameIt: "Lager",
      beschreibungIt: "Una birra",
      kategorieId,
      slug: "lager",
    });

    await asEmployee.mutation(api.produkte.remove, { id });

    const list = await t.query(api.produkte.listByKategorie, { kategorieId });
    expect(list).toHaveLength(0);
  });

  it("rejects update and remove from unauthenticated users", async () => {
    const t = convexTest(schema, modules);

    // Create real documents so the validator doesn't reject the IDs
    const kategorieId = await t.run(async (ctx) => {
      return await ctx.db.insert("kategorien", {
        name: "Test",
        nameIt: "Test",
        slug: "test",
      });
    });

    const storageId = await t.run(async (ctx) => {
      const blob = new Blob([new Uint8Array([1])], { type: "image/png" });
      return await ctx.storage.store(blob);
    });

    const produktId = await t.run(async (ctx) => {
      return await ctx.db.insert("produkte", {
        name: "P",
        beschreibung: "B",
        foto: storageId,
        nameIt: "P",
        beschreibungIt: "B",
        kategorieId,
        slug: "p",
      });
    });

    await expect(
      t.mutation(api.produkte.update, {
        id: produktId,
        name: "X",
        beschreibung: "X",
        nameIt: "X",
        beschreibungIt: "X",
        kategorieId,
        slug: "x",
      })
    ).rejects.toThrowError(/Not authenticated/i);

    await expect(
      t.mutation(api.produkte.remove, { id: produktId })
    ).rejects.toThrowError(/Not authenticated/i);
  });
});

