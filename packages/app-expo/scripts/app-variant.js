const APP_VARIANTS = {
  development: {
    key: "development",
    name: "ReadAny Dev",
    bundleIdentifier: "com.readany.app.dev",
    androidPackage: "com.readany.app.dev",
    scheme: "readany-dev",
  },
  preview: {
    key: "preview",
    name: "ReadAny Preview",
    bundleIdentifier: "com.readany.app.preview",
    androidPackage: "com.readany.app.preview",
    scheme: "readany-preview",
  },
  // E-ink build for Onyx BOOX-firmware tablets; installs next to the regular app.
  eink: {
    key: "eink",
    name: "ReadAny 墨水屏",
    bundleIdentifier: "com.readany.app.eink",
    androidPackage: "com.readany.app.eink",
    scheme: "readany-eink",
  },
  production: {
    key: "production",
    name: "ReadAny",
    bundleIdentifier: "com.readany.app",
    androidPackage: "com.readany.app",
    scheme: "readany",
  },
};

const VARIANT_ALIASES = {
  dev: "development",
  development: "development",
  local: "development",
  debug: "development",
  "development-simulator": "development",
  preview: "preview",
  staging: "preview",
  test: "preview",
  prod: "production",
  production: "production",
  release: "production",
  eink: "eink",
};

function normalizeAppVariant(value) {
  const rawVariant = String(value || "")
    .trim()
    .toLowerCase();

  if (VARIANT_ALIASES[rawVariant]) {
    return VARIANT_ALIASES[rawVariant];
  }

  if (rawVariant.includes("production")) {
    return "production";
  }

  if (rawVariant.includes("preview") || rawVariant.includes("staging")) {
    return "preview";
  }

  return "development";
}

function getAppVariant() {
  return normalizeAppVariant(
    process.env.APP_VARIANT || process.env.EAS_BUILD_PROFILE || "development",
  );
}

function getAppVariantConfig() {
  return APP_VARIANTS[getAppVariant()];
}

module.exports = {
  APP_VARIANTS,
  getAppVariant,
  getAppVariantConfig,
  normalizeAppVariant,
};
