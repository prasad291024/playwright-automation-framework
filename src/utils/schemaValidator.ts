import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';

/**
 * Schema Validator Utility
 *
 * Provides JSON Schema validation for API responses using AJV (Another JSON Schema Validator).
 * Schemas are loaded from the ./schemas directory.
 *
 * Usage:
 *   const validator = new SchemaValidator();
 *   const result = validator.validate(response, 'user.schema.json');
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export class SchemaValidator {
  private ajv: Ajv;
  private schemas: Map<string, any> = new Map();
  private schemaDir: string;

  constructor(schemaDir?: string) {
    this.ajv = new Ajv({
      allErrors: true,
    });

    this.schemaDir = schemaDir || path.resolve(process.cwd(), 'schemas');

    if (!fs.existsSync(this.schemaDir)) {
      throw new Error(`Schemas directory not found at ${this.schemaDir}`);
    }
  }

  /**
   * Load a schema file and compile it
   * @param schemaFileName - Name of the schema file (e.g., 'user.schema.json')
   * @returns Compiled schema validator
   */
  private loadSchema(schemaFileName: string): any {
    // Check if already compiled
    if (this.schemas.has(schemaFileName)) {
      return this.schemas.get(schemaFileName)!;
    }

    // Load from filesystem
    const schemaPath = path.join(this.schemaDir, schemaFileName);

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);

    // Compile and cache
    const validate = this.ajv.compile(schema);
    this.schemas.set(schemaFileName, validate);

    return validate;
  }

  /**
   * Validate data against a schema
   * @param data - The data to validate
   * @param schemaFileName - Name of the schema file
   * @returns Validation result with errors if invalid
   */
  validate(data: any, schemaFileName: string): ValidationResult {
    const validate = this.loadSchema(schemaFileName);
    const isValid = validate(data);

    return {
      isValid,
      errors: validate.errors || [],
      data,
    };
  }

  /**
   * Validate and throw error if invalid
   * @param data - The data to validate
   * @param schemaFileName - Name of the schema file
   * @throws Error if validation fails
   */
  validateOrThrow(data: any, schemaFileName: string): void {
    const result = this.validate(data, schemaFileName);

    if (!result.isValid) {
      const errorMessages = result.errors
        .map((err) => `${err.instancePath || '$'} ${err.message}`)
        .join(', ');

      throw new Error(`Schema validation failed for ${schemaFileName}: ${errorMessages}`);
    }
  }

  /**
   * Get human-readable error messages
   * @param schemaFileName - Name of the schema file
   * @param data - The data that failed validation
   * @returns Array of readable error messages
   */
  getErrorMessages(schemaFileName: string, data: any): string[] {
    const result = this.validate(data, schemaFileName);

    return result.errors.map((err) => {
      const path = err.instancePath || 'root';
      const message = err.message || 'unknown error';
      return `${path}: ${message}`;
    });
  }

  /**
   * Clear cached schemas
   */
  clearCache(): void {
    this.schemas.clear();
  }
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: any[];
  data: any;
}

/**
 * Singleton instance for easy access
 */
export const schemaValidator = new SchemaValidator();
