module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:4173/",
        "http://127.0.0.1:4173/privacy.html",
        "http://127.0.0.1:4173/imprint.html",
      ],
      numberOfRuns: 2,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["warn", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
}
