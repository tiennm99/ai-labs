// Test 1: npm run dev starts without errors
// Test 2: Browser displays Canvas element with colored background
// Test 3: npm run test runs vitest successfully

import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have vite as a dev dependency', () => {
    // Read package.json to verify vite is installed
    const pkg = require('../../package.json');
    expect(pkg.devDependencies).toHaveProperty('vite');
  });

  it('should have typescript as a dev dependency', () => {
    const pkg = require('../../package.json');
    expect(pkg.devDependencies).toHaveProperty('typescript');
  });

  it('should have vitest as a dev dependency', () => {
    const pkg = require('../../package.json');
    expect(pkg.devDependencies).toHaveProperty('vitest');
  });

  it('should have npm scripts for dev, test, and build', () => {
    const pkg = require('../../package.json');
    expect(pkg.scripts).toHaveProperty('dev');
    expect(pkg.scripts).toHaveProperty('test');
    expect(pkg.scripts).toHaveProperty('build');
  });
});
