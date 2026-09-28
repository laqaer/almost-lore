import assert from "node:assert/strict";
import test from "node:test";

import {
  ADS_TXT_CERTIFICATION_AUTHORITY,
  adsConfig,
  adsPublisherId,
  adsRunnableConfig,
  publisherIdFromClient,
} from "./ads.ts";

const KEYS = ["NEXT_PUBLIC_ADS_ENABLED", "NEXT_PUBLIC_ADS_PUBLISHER_ID", "NEXT_PUBLIC_ADS_SLOT"];

function withEnv(values: Record<string, string>, run: () => void) {
  const saved = new Map(KEYS.map((key) => [key, process.env[key]]));
  for (const key of KEYS) delete process.env[key];
  Object.assign(process.env, values);
  try {
    run();
  } finally {
    for (const [key, value] of saved) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("ads are off with no configuration", () => {
  withEnv({}, () => {
    assert.equal(adsConfig().enabled, false);
    assert.equal(adsPublisherId(), null);
    assert.equal(adsRunnableConfig(), null);
  });
});

test("a malformed publisher id keeps ads off", () => {
  withEnv(
    { NEXT_PUBLIC_ADS_ENABLED: "true", NEXT_PUBLIC_ADS_PUBLISHER_ID: "pub-1234", NEXT_PUBLIC_ADS_SLOT: "1234567890" },
    () => {
      assert.equal(adsConfig().enabled, false);
      assert.equal(adsPublisherId(), null);
    },
  );
});

test("a valid publisher id without a slot stays off", () => {
  withEnv(
    { NEXT_PUBLIC_ADS_ENABLED: "true", NEXT_PUBLIC_ADS_PUBLISHER_ID: "ca-pub-0000000000000000" },
    () => assert.equal(adsConfig().enabled, false),
  );
});

test("valid ids configure ads but never serve without a consent platform", () => {
  withEnv(
    {
      NEXT_PUBLIC_ADS_ENABLED: "true",
      NEXT_PUBLIC_ADS_PUBLISHER_ID: "ca-pub-0000000000000000",
      NEXT_PUBLIC_ADS_SLOT: "1234567890",
    },
    () => {
      const config = adsConfig();
      assert.equal(config.enabled, true);
      assert.equal(config.enabled && config.publisherId, "pub-0000000000000000");
      // No certified CMP is wired, so nothing is served even when configured.
      assert.equal(adsRunnableConfig(), null);
    },
  );
});

test("ads.txt can list a seller before ads serve", () => {
  withEnv({ NEXT_PUBLIC_ADS_PUBLISHER_ID: "ca-pub-1111111111111111" }, () => {
    assert.equal(adsPublisherId(), "pub-1111111111111111");
    assert.equal(adsConfig().enabled, false);
  });
});

test("publisher id parsing rejects junk", () => {
  assert.equal(publisherIdFromClient("ca-pub-1234567890123456"), "pub-1234567890123456");
  assert.equal(publisherIdFromClient("pub-1234567890123456"), null);
  assert.equal(publisherIdFromClient("ca-pub-1234"), null);
  assert.equal(publisherIdFromClient(""), null);
});

test("the ads.txt certification authority is Google's", () => {
  assert.equal(ADS_TXT_CERTIFICATION_AUTHORITY, "f08c47fec0942fa0");
});
