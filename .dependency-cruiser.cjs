/** Import hierarchy: atoms < molecules < organisms < templates < app. See src/README.md. */

const FEATURE_ENTRY = "^src/features/[^/]+/index\\.tsx?$";

/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies hide layering mistakes.",
      from: {},
      to: { circular: true },
    },
    {
      name: "atoms-only-use-lib",
      severity: "error",
      comment: "Atoms depend on lib and styles only.",
      from: { path: "^src/components/atoms/" },
      to: { path: "^src/(components/(molecules|organisms|templates)|features|server|app)/" },
    },
    {
      name: "molecules-only-use-atoms",
      severity: "error",
      comment: "Molecules import atoms and lib only.",
      from: { path: "^src/components/molecules/" },
      to: { path: "^src/(components/(organisms|templates)|features|server|app)/" },
    },
    {
      name: "organisms-stay-below-templates",
      severity: "error",
      comment: "Organisms import molecules, atoms, lib and feature public APIs.",
      from: { path: "^src/components/organisms/" },
      to: { path: "^src/(components/templates|server|app)/" },
    },
    {
      name: "templates-stay-below-pages",
      severity: "error",
      comment: "Templates import organisms and below.",
      from: { path: "^src/components/templates/" },
      to: { path: "^src/(server|app)/" },
    },
    {
      name: "pages-assemble-templates-and-organisms",
      severity: "error",
      comment: "Pages and layouts import templates and organisms, never atoms or molecules.",
      from: { path: "^src/app/.*(page|layout)\\.tsx$" },
      to: { path: "^src/components/(atoms|molecules)/" },
    },
    {
      name: "components-never-use-server-infrastructure",
      severity: "error",
      comment: "UI code must not reach adapters.",
      from: { path: "^src/(components|features)/" },
      to: { path: "^src/server/infrastructure/" },
    },
    {
      name: "server-never-uses-ui",
      severity: "error",
      comment: "Server code does not depend on UI or routes.",
      from: { path: "^src/server/" },
      to: { path: "^src/(components|features|app)/" },
    },
    {
      name: "domain-is-self-contained",
      severity: "error",
      comment: "Domain depends on lib only.",
      from: { path: "^src/server/domain/" },
      to: { path: "^src/server/(services|infrastructure)/" },
    },
    {
      name: "services-do-not-use-infrastructure",
      severity: "error",
      comment: "Services depend on domain; infrastructure implements their ports.",
      from: { path: "^src/server/services/" },
      to: { path: "^src/server/infrastructure/" },
    },
    {
      name: "features-expose-index-only",
      severity: "error",
      comment: "Import a feature through its public index.ts, not its internals.",
      from: { path: "^src/features/([^/]+)/" },
      to: {
        path: "^src/features/[^/]+/.+",
        pathNot: ["^src/features/$1/", FEATURE_ENTRY],
      },
    },
    {
      name: "features-public-api-only-from-outside",
      severity: "error",
      comment: "Import a feature through its public index.ts, not its internals.",
      from: { pathNot: "^src/features/" },
      to: { path: "^src/features/[^/]+/.+", pathNot: FEATURE_ENTRY },
    },
    {
      name: "lib-is-leaf",
      severity: "error",
      comment: "lib has no knowledge of the application.",
      from: { path: "^src/lib/" },
      to: { path: "^src/(components|features|server|app)/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    exclude: { path: "\\.(test|spec|stories)\\.tsx?$" },
  },
};
