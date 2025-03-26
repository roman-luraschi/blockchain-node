module.exports = {
    preset: "ts-jest",            // Usa ts-jest para TypeScript
    testEnvironment: "node",      // Entorno de testing (Node.js)
    testMatch: ["**/*.test.ts"],  // Patrón para archivos de test
    collectCoverage: true,        // Genera reporte de cobertura
    coverageDirectory: "coverage",// Carpeta para reportes
    verbose: true,                // Muestra detalles en consola
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"  // Soporta alias de imports (opcional)
    }
  };