import { ObjectId } from 'mongodb';

/**
 * Check if a value is a MongoDB ObjectId
 */
export function isObjectId(value: unknown): value is ObjectId {
  return (
    value instanceof ObjectId ||
    (typeof value === 'object' &&
      value !== null &&
      '__t' in value &&
      (value as { __t: unknown }).__t === 'ObjectId')
  );
}

/**
 * Check if a value is a Date
 */
export function isDate(value: unknown): value is Date {
  return (
    value instanceof Date ||
    Object.prototype.toString.call(value) === '[object Date]'
  );
}

/**
 * Serialize ObjectId to string
 */
function serializeObjectId(value: unknown): string {
  if (isObjectId(value)) {
    return value.toString();
  }

  if (Buffer.isBuffer(value) && value.length === 12) {
    return new ObjectId(value).toString();
  }

  // Handle nested buffer structure from TypeORM
  if (typeof value === 'object' && value !== null && 'buffer' in value) {
    const bufferValue = value as {
      buffer: { type: string; data: number[] } | Buffer;
    };

    // Handle Buffer object
    if (Buffer.isBuffer(bufferValue.buffer)) {
      if (bufferValue.buffer.length === 12) {
        return new ObjectId(bufferValue.buffer).toString();
      }
      return bufferValue.buffer.toString('hex');
    }

    // Handle object with type: 'Buffer' and data array
    if (
      typeof bufferValue.buffer === 'object' &&
      bufferValue.buffer !== null &&
      'type' in bufferValue.buffer &&
      'data' in bufferValue.buffer &&
      bufferValue.buffer.type === 'Buffer' &&
      Array.isArray(bufferValue.buffer.data)
    ) {
      const data = bufferValue.buffer.data;
      if (data.length === 12) {
        return new ObjectId(Buffer.from(data)).toString();
      }
    }
  }

  // Fallback: try to convert to string
  return String(value);
}

/**
 * Serialize Date to ISO string
 */
function serializeDate(value: Date): string {
  return value.toISOString();
}

/**
 * Convert MongoDB ObjectId to string recursively
 * This handles the _id buffer serialization issue
 */
export function serializeMongoData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle ObjectId directly
  if (isObjectId(data)) {
    return (data as ObjectId).toString() as unknown as T;
  }

  // Handle Date directly
  if (isDate(data)) {
    return (data as Date).toISOString() as unknown as T;
  }

  // Handle Buffer (convert to base64 string or ObjectId string if it's an ObjectId)
  if (Buffer.isBuffer(data)) {
    // Check if it looks like an ObjectId (12 bytes)
    if (data.length === 12) {
      return new ObjectId(data).toString() as unknown as T;
    }
    return data.toString('base64') as unknown as T;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeMongoData(item)) as unknown as T;
  }

  // Handle objects
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      // Handle _id field specifically
      if (key === '_id') {
        result[key] = serializeObjectId(value);
      }
      // Handle date fields (common patterns)
      else if (
        key === 'createdAt' ||
        key === 'updatedAt' ||
        key === 'deletedAt'
      ) {
        if (isDate(value)) {
          result[key] = serializeDate(value);
        } else if (value === null || value === undefined) {
          result[key] = value;
        } else if (
          typeof value === 'object' &&
          Object.keys(value).length === 0
        ) {
          // Handle empty date object from TypeORM
          result[key] = new Date().toISOString();
        } else {
          result[key] = serializeMongoData(value);
        }
      } else {
        result[key] = serializeMongoData(value);
      }
    }

    return result as T;
  }

  return data;
}

/**
 * Safe version that won't throw errors
 */
export function safeSerializeMongoData<T>(data: T): T {
  try {
    return serializeMongoData(data);
  } catch {
    return data;
  }
}
