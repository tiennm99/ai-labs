// src/game/EventEmitter.ts - Typed event emitter wrapper
/**
 * TypedEventEmitter provides a type-safe wrapper around Node's EventEmitter.
 * It ensures event names and payloads are correctly typed.
 */

import { EventEmitter } from 'events';

export class TypedEventEmitter<T extends Record<string, unknown>> {
  private emitter = new EventEmitter();

  /**
   * Register a listener for an event
   * @param event - The event name (type-safe)
   * @param listener - The callback function (payload is type-safe)
   * @returns this for chaining
   */
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    this.emitter.on(event as string, listener);
    return this;
  }

  /**
   * Register a one-time listener for an event
   * @param event - The event name (type-safe)
   * @param listener - The callback function (payload is type-safe)
   * @returns this for chaining
   */
  once<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    this.emitter.once(event as string, listener);
    return this;
  }

  /**
   * Emit an event with payload
   * @param event - The event name (type-safe)
   * @param data - The payload (type-safe)
   * @returns true if listeners were called, false otherwise
   */
  emit<K extends keyof T>(event: K, data: T[K]): boolean {
    return this.emitter.emit(event as string, data);
  }

  /**
   * Remove a specific listener for an event
   * @param event - The event name (type-safe)
   * @param listener - The callback function to remove
   * @returns this for chaining
   */
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    this.emitter.off(event as string, listener);
    return this;
  }

  /**
   * Remove all listeners for an event
   * @param event - The event name (type-safe)
   * @returns this for chaining
   */
  removeAllListeners<K extends keyof T>(event: K): this {
    this.emitter.removeAllListeners(event as string);
    return this;
  }
}
