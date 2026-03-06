import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import schema from "./schema";
import { api } from "./_generated/api";
import { modules } from "./test.setup";

describe("authz + invites flow", () => {
  it("bootstraps initial admin when configured", async () => {
    const t = convexTest(schema, modules);

    const adminIdentity = {
      subject: "sub_admin",
      email: "admin@example.com",
      name: "Admin",
    };
    const asAdmin = t.withIdentity(adminIdentity);

    delete process.env.INITIAL_ADMIN_EMAIL;
    await expect(
      asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {})
    ).resolves.toEqual({ created: false });

    process.env.INITIAL_ADMIN_EMAIL = "someoneelse@example.com";
    await expect(
      asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {})
    ).resolves.toEqual({ created: false });

    process.env.INITIAL_ADMIN_EMAIL = "admin@example.com";
    await expect(
      asAdmin.mutation(api.bootstrap.bootstrapInitialAdmin, {})
    ).resolves.toEqual({ created: true });

    const me = await asAdmin.query(api.users.me, {});
    expect(me).toMatchObject({
      email: "admin@example.com",
      role: "admin",
      disabled: false,
    });
  });

  it("allows admin to invite and employee to accept", async () => {
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
    expect(invite).toMatchObject({
      email: "employee@example.com",
      role: "employee",
    });
    expect(typeof invite.token).toBe("string");

    const asEmployee = t.withIdentity({
      subject: "sub_employee",
      email: "employee@example.com",
      name: "Employee",
    });
    await expect(
      asEmployee.mutation(api.users.acceptInvite, { token: invite.token })
    ).resolves.toBeNull();

    const employeeMe = await asEmployee.query(api.users.me, {});
    expect(employeeMe).toMatchObject({
      email: "employee@example.com",
      role: "employee",
      disabled: false,
    });

    await expect(
      asEmployee.mutation(api.users.acceptInvite, { token: invite.token })
    ).rejects.toThrowError(/already used/i);
  });

  it("enforces admin-only and employee/admin-only mutations", async () => {
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

    await expect(asEmployee.query(api.users.listUsers, {})).rejects.toThrowError(
      /Admin access required/i
    );

    await expect(
      asEmployee.mutation(api.oeffnungszeiten.update, {
        tag: "Mo-Fr",
        von1: "08:00",
        bis1: "12:00",
        von2: "14:30",
        bis2: "18:30",
        geschlossen: false,
      })
    ).rejects.toThrowError(/Admin access required/i);

    await expect(
      asEmployee.mutation(api.clearProducts.clearProducts, {})
    ).rejects.toThrowError(/Admin access required/i);
  });

  it("allows admin to disable users (but not self)", async () => {
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

    const users = await asAdmin.query(api.users.listUsers, {});
    const employee = users.find((u) => u.email === "employee@example.com");
    expect(employee).toBeTruthy();

    await expect(
      asAdmin.mutation(api.users.setUserDisabled, {
        userId: users.find((u) => u.email === "admin@example.com")!._id,
        disabled: true,
      })
    ).rejects.toThrowError(/Cannot change own status/i);

    await asAdmin.mutation(api.users.setUserDisabled, {
      userId: employee!._id,
      disabled: true,
    });

    await expect(asEmployee.query(api.users.me, {})).rejects.toThrowError(
      /User disabled/i
    );
  });
});

