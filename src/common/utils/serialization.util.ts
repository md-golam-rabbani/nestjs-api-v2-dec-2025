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
        if (isObjectId(value)) {
          result[key] = value.toString();
        } else if (Buffer.isBuffer(value)) {
          // Check if it's an ObjectId buffer (12 bytes)
          if (value.length === 12) {
            result[key] = new ObjectId(value).toString();
          } else {
            result[key] = value.toString('base64');
          }
        } else if (typeof value === 'object' && value !== null && 'buffer' in value) {
          // Handle nested buffer structure
          const bufferValue = value as { buffer: { data: number[] } };
          if (Array.isArray(bufferValue.buffer.data) && bufferValue.buffer.data.length === 12) {
            result[key] = new ObjectId(Buffer.from(bufferValue.buffer.data)).toString();
          } else {
            result[key] = JSON.stringify(value);
          }
        } else {
          result[key] = value;
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
