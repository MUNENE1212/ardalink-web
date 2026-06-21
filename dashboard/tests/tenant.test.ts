import { describe, it, expect, beforeEach } from "vitest";

import {
  getTenantContext,
  hasFlag,
  setTenantContext,
  tenantHeaders,
  type TenantContext,
} from "../src/lib/tenant";

const future = Math.floor(Date.now() / 1000) + 3600;
const ctx: TenantContext = {
  tenantId: "bula-pesa",
  displayName: "Bula Pesa",
  region: "Isiolo County",
  flags: { voice_outbound: true, public_talk: true },
  exp: future,
};

describe("tenant context", () => {
  beforeEach(() => setTenantContext(null));

  it("returns null when unset", () => {
    expect(getTenantContext()).toBeNull();
    expect(tenantHeaders()).toEqual({});
    expect(hasFlag("voice_outbound")).toBe(false);
  });

  it("returns the active context", () => {
    setTenantContext(ctx);
    expect(getTenantContext()?.tenantId).toBe("bula-pesa");
    expect(hasFlag("voice_outbound")).toBe(true);
    expect(hasFlag("public_talk")).toBe(true);
    expect(hasFlag("ground_truth")).toBe(false);
  });

  it("builds X-Client-Tenant-ID headers", () => {
    setTenantContext(ctx);
    expect(tenantHeaders()).toEqual({ "X-Client-Tenant-ID": "bula-pesa" });
  });

  it("drops an expired context on read", () => {
    setTenantContext({ ...ctx, exp: 1 });
    expect(getTenantContext()).toBeNull();
  });
});
