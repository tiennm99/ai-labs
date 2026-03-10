// src/game/EventEmitter.ts - Typed event emitter (browser-compatible)
/**
 * TypedEventEmitter provides a type-safe event system that works in browsers.
 * Custom implementation - no Node.js dependencies.
 */

export class TypedEventEmitter<T extends object> {
  private listeners = new Map<keyof T, Set<(data: T[keyof T]) => void>>();

  /**
   * Register a listener for an event
   * @param event - The event name (type-safe)
   * @param listener - The callback function (payload is type-safe)
   * @returns this for chaining
   */
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as (data: T[keyof T]) => void);
    return this;
  }

  /**
   * Register a one-time listener for an event
   * @param event - The event name (type-safe)
   * @param listener - The callback function (payload is type-safe)
   * @returns this for chaining
   */
  once<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    const onceWrapper = (data: T[K]) => {
      this.off(event, onceWrapper);
      listener(data);
    };
    return this.on(event, onceWrapper);
  }

  /**
   * Emit an event with payload
   * @param event - The event name (type-safe)
   * @param data - The payload (type-safe)
   * @returns true if listeners were called, false otherwise
   */
  emit<K extends keyof T>(event: K, data: T[K]): boolean {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.size === 0) {
      return false;
    }
    eventListeners.forEach(listener => listener(data as T[keyof T]));
    return true;
  }

  /**
   * Remove a specific listener for an event
   * @param event - The event name (type-safe)
   * @param listener - The callback function to remove
   * @returns this for chaining
   */
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener as (data: T[keyof T]) => void);
    }
    return this;
  }

  /**
   * Remove all listeners for an event
   * @param event - The event name (type-safe)
   * @returns this for chaining
   */
  removeAllListeners<K extends keyof T>(event: K): this {
    this.listeners.delete(event);
    return this;
  }
}
