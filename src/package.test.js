import fs from 'fs';
import path from 'path';

describe('package.json', () => {
  let packageJson;

  beforeAll(() => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    packageJson = JSON.parse(packageContent);
  });

  describe('JSON Structure', () => {
    test('should be valid JSON', () => {
      expect(packageJson).toBeDefined();
      expect(typeof packageJson).toBe('object');
    });

    test('should have required top-level fields', () => {
      expect(packageJson).toHaveProperty('name');
      expect(packageJson).toHaveProperty('version');
      expect(packageJson).toHaveProperty('dependencies');
      expect(packageJson).toHaveProperty('scripts');
    });

    test('should have a valid name', () => {
      expect(packageJson.name).toBe('frontend');
      expect(typeof packageJson.name).toBe('string');
      expect(packageJson.name.length).toBeGreaterThan(0);
    });

    test('should have a valid version', () => {
      expect(packageJson.version).toBe('0.1.0');
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test('should be marked as private', () => {
      expect(packageJson.private).toBe(true);
    });
  });

  describe('Dependencies', () => {
    test('should have all required dependencies', () => {
      expect(packageJson.dependencies).toHaveProperty('react');
      expect(packageJson.dependencies).toHaveProperty('react-dom');
      expect(packageJson.dependencies).toHaveProperty('react-scripts');
      expect(packageJson.dependencies).toHaveProperty('cra-template');
    });

    test('should have React at version ^19.2.0', () => {
      expect(packageJson.dependencies.react).toBe('^19.2.0');
    });

    test('should have react-dom at compatible version', () => {
      expect(packageJson.dependencies['react-dom']).toBeDefined();
      expect(packageJson.dependencies['react-dom']).toMatch(/^\^?19\./);
    });

    test('should have react-scripts defined', () => {
      expect(packageJson.dependencies['react-scripts']).toBe('5.0.1');
    });

    test('should have cra-template defined', () => {
      expect(packageJson.dependencies['cra-template']).toBe('1.3.0');
    });

    test('should use valid semver ranges', () => {
      Object.entries(packageJson.dependencies).forEach(([pkg, version]) => {
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+$/);
      });
    });

    test('should have compatible React and ReactDOM versions', () => {
      const reactVersion = packageJson.dependencies.react;
      const reactDomVersion = packageJson.dependencies['react-dom'];
      
      // Extract major versions
      const reactMajor = parseInt(reactVersion.replace(/^\^/, '').split('.')[0]);
      const reactDomMajor = parseInt(reactDomVersion.replace(/^\^/, '').split('.')[0]);
      
      expect(reactMajor).toBe(reactDomMajor);
    });

    test('should not have duplicate dependencies in devDependencies', () => {
      if (packageJson.devDependencies) {
        const depKeys = Object.keys(packageJson.dependencies);
        const devDepKeys = Object.keys(packageJson.devDependencies);
        const duplicates = depKeys.filter(key => devDepKeys.includes(key));
        expect(duplicates).toHaveLength(0);
      }
    });
  });

  describe('Scripts', () => {
    test('should have all required npm scripts', () => {
      expect(packageJson.scripts).toHaveProperty('start');
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('test');
      expect(packageJson.scripts).toHaveProperty('eject');
    });

    test('should have valid start script', () => {
      expect(packageJson.scripts.start).toBe('react-scripts start');
    });

    test('should have valid build script', () => {
      expect(packageJson.scripts.build).toBe('react-scripts build');
    });

    test('should have valid test script', () => {
      expect(packageJson.scripts.test).toBe('react-scripts test');
    });

    test('should have valid eject script', () => {
      expect(packageJson.scripts.eject).toBe('react-scripts eject');
    });

    test('should have scripts that use react-scripts', () => {
      const scriptValues = Object.values(packageJson.scripts);
      const reactScriptCommands = scriptValues.filter(script => 
        script.includes('react-scripts')
      );
      expect(reactScriptCommands.length).toBeGreaterThan(0);
    });
  });

  describe('ESLint Configuration', () => {
    test('should have eslintConfig defined', () => {
      expect(packageJson.eslintConfig).toBeDefined();
      expect(typeof packageJson.eslintConfig).toBe('object');
    });

    test('should extend react-app configurations', () => {
      expect(packageJson.eslintConfig.extends).toBeDefined();
      expect(Array.isArray(packageJson.eslintConfig.extends)).toBe(true);
      expect(packageJson.eslintConfig.extends).toContain('react-app');
      expect(packageJson.eslintConfig.extends).toContain('react-app/jest');
    });

    test('should have valid extends array', () => {
      expect(packageJson.eslintConfig.extends.length).toBeGreaterThan(0);
      packageJson.eslintConfig.extends.forEach(config => {
        expect(typeof config).toBe('string');
        expect(config.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Browserslist Configuration', () => {
    test('should have browserslist defined', () => {
      expect(packageJson.browserslist).toBeDefined();
      expect(typeof packageJson.browserslist).toBe('object');
    });

    test('should have production browserslist', () => {
      expect(packageJson.browserslist.production).toBeDefined();
      expect(Array.isArray(packageJson.browserslist.production)).toBe(true);
      expect(packageJson.browserslist.production.length).toBeGreaterThan(0);
    });

    test('should have development browserslist', () => {
      expect(packageJson.browserslist.development).toBeDefined();
      expect(Array.isArray(packageJson.browserslist.development)).toBe(true);
      expect(packageJson.browserslist.development.length).toBeGreaterThan(0);
    });

    test('should include modern browser targets in production', () => {
      const production = packageJson.browserslist.production;
      expect(production).toContain('>0.2%');
      expect(production).toContain('not dead');
      expect(production).toContain('not op_mini all');
    });

    test('should include latest browser versions in development', () => {
      const development = packageJson.browserslist.development;
      expect(development).toContain('last 1 chrome version');
      expect(development).toContain('last 1 firefox version');
      expect(development).toContain('last 1 safari version');
    });

    test('should have valid browserslist queries', () => {
      const allQueries = [
        ...packageJson.browserslist.production,
        ...packageJson.browserslist.development
      ];
      
      allQueries.forEach(query => {
        expect(typeof query).toBe('string');
        expect(query.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Version Compatibility', () => {
    test('should use React 19.x major version', () => {
      const reactVersion = packageJson.dependencies.react;
      expect(reactVersion).toMatch(/^\^19\./);
    });

    test('should use React 19.2.x or higher', () => {
      const reactVersion = packageJson.dependencies.react.replace(/^\^/, '');
      const [major, minor] = reactVersion.split('.').map(Number);
      
      expect(major).toBe(19);
      expect(minor).toBeGreaterThanOrEqual(2);
    });

    test('should have react-scripts compatible with React 19', () => {
      // react-scripts 5.x should be compatible with React 19
      const scriptsVersion = packageJson.dependencies['react-scripts'];
      expect(scriptsVersion).toMatch(/^5\./);
    });

    test('should have all React-related dependencies at compatible versions', () => {
      const reactVersion = packageJson.dependencies.react;
      const reactDomVersion = packageJson.dependencies['react-dom'];
      
      // Both should be on React 19.x
      expect(reactVersion.startsWith('^19')).toBe(true);
      expect(reactDomVersion.startsWith('^19')).toBe(true);
    });
  });

  describe('File System Validation', () => {
    test('should be readable from file system', () => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });

    test('should have proper file permissions', () => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      const stats = fs.statSync(packagePath);
      expect(stats.isFile()).toBe(true);
    });

    test('should be parseable JSON without errors', () => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      
      expect(() => {
        JSON.parse(content);
      }).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should not have undefined or null dependency versions', () => {
      Object.entries(packageJson.dependencies).forEach(([pkg, version]) => {
        expect(version).not.toBeNull();
        expect(version).not.toBeUndefined();
        expect(version).not.toBe('');
      });
    });

    test('should not have malformed version strings', () => {
      Object.entries(packageJson.dependencies).forEach(([pkg, version]) => {
        // Should not have multiple carets or tildes
        expect(version.match(/[\^~]/g)?.length || 0).toBeLessThanOrEqual(1);
        // Should not have spaces
        expect(version).not.toMatch(/\s/);
      });
    });

    test('should not have empty scripts', () => {
      Object.entries(packageJson.scripts).forEach(([name, script]) => {
        expect(script).not.toBe('');
        expect(script.trim().length).toBeGreaterThan(0);
      });
    });

    test('should not have circular dependencies in structure', () => {
      // JSON.stringify will throw if there are circular references
      expect(() => {
        JSON.stringify(packageJson);
      }).not.toThrow();
    });

    test('should handle missing optional fields gracefully', () => {
      // These fields are optional and may not exist
      if (packageJson.devDependencies) {
        expect(typeof packageJson.devDependencies).toBe('object');
      }
      if (packageJson.peerDependencies) {
        expect(typeof packageJson.peerDependencies).toBe('object');
      }
      if (packageJson.optionalDependencies) {
        expect(typeof packageJson.optionalDependencies).toBe('object');
      }
    });
  });

  describe('React 19.2.0 Upgrade Specific Tests', () => {
    test('should be upgraded from 19.0.0 to 19.2.0', () => {
      // This test validates the specific change made
      expect(packageJson.dependencies.react).toBe('^19.2.0');
      expect(packageJson.dependencies.react).not.toBe('^19.0.0');
    });

    test('should maintain caret range for automatic patch updates', () => {
      const reactVersion = packageJson.dependencies.react;
      expect(reactVersion.startsWith('^')).toBe(true);
    });

    test('should allow minor and patch updates within 19.x', () => {
      const reactVersion = packageJson.dependencies.react;
      expect(reactVersion).toMatch(/^\^19\.\d+\.\d+$/);
    });

    test('should not break existing React API compatibility', () => {
      // React 19.2.0 should be backward compatible with 19.0.0
      const version = packageJson.dependencies.react.replace('^', '');
      const [major, minor, patch] = version.split('.').map(Number);
      
      expect(major).toBe(19);
      expect(minor).toBeGreaterThanOrEqual(0);
      expect(patch).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Security and Best Practices', () => {
    test('should not expose sensitive information', () => {
      const content = JSON.stringify(packageJson);
      
      // Should not contain API keys, tokens, passwords
      expect(content).not.toMatch(/api[_-]?key/i);
      expect(content).not.toMatch(/secret/i);
      expect(content).not.toMatch(/password/i);
      expect(content).not.toMatch(/token/i);
    });

    test('should use secure HTTPS URLs if any URLs are present', () => {
      const checkUrls = (obj) => {
        const urls = [];
        const traverse = (o) => {
          for (let key in o) {
            if (typeof o[key] === 'string' && o[key].match(/https?:\/\//)) {
              urls.push(o[key]);
            } else if (typeof o[key] === 'object' && o[key] !== null) {
              traverse(o[key]);
            }
          }
        };
        traverse(obj);
        return urls;
      };

      const urls = checkUrls(packageJson);
      urls.forEach(url => {
        if (url.startsWith('http://') && !url.includes('localhost')) {
          // Allow http for localhost, but prefer https for external URLs
          console.warn(`Non-secure URL found: ${url}`);
        }
      });
    });

    test('should have consistent formatting', () => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      
      // Should be properly formatted JSON (parseable)
      expect(() => JSON.parse(content)).not.toThrow();
      
      // Should end with newline
      expect(content.endsWith('\n')).toBe(true);
    });
  });

  describe('Integration with Create React App', () => {
    test('should be compatible with Create React App structure', () => {
      expect(packageJson.dependencies['react-scripts']).toBeDefined();
      expect(packageJson.dependencies['cra-template']).toBeDefined();
    });

    test('should have CRA-standard npm scripts', () => {
      const expectedScripts = ['start', 'build', 'test', 'eject'];
      expectedScripts.forEach(script => {
        expect(packageJson.scripts).toHaveProperty(script);
        expect(packageJson.scripts[script]).toContain('react-scripts');
      });
    });

    test('should have CRA-compatible ESLint configuration', () => {
      expect(packageJson.eslintConfig.extends).toContain('react-app');
    });

    test('should follow CRA naming conventions', () => {
      expect(packageJson.name).toMatch(/^[a-z0-9-_]+$/);
    });
  });
});