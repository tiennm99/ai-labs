// src/__tests__/EventEmitter.test.ts - Unit tests for TypedEventEmitter class
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TypedEventEmitter } from '../game/EventEmitter';

// Define a test event map
interface TestEvents {
  'test:event': { value: number };
  'test:message': string;
  'test:empty': void;
  'error': Error;
}

describe('TypedEventEmitter', () => {
  let emitter: TypedEventEmitter<TestEvents>;

  beforeEach(() => {
    emitter = new TypedEventEmitter<TestEvents>();
  });

  describe('on()', () => {
    it('should register a listener for an event', () => {
      const listener = vi.fn();
      emitter.on('test:event', listener);
      emitter.emit('test:event', { value: 42 });
      expect(listener).toHaveBeenCalledWith({ value: 42 });
    });

    it('should register multiple listeners for the same event', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      emitter.on('test:event', listener1);
      emitter.on('test:event', listener2);
      emitter.emit('test:event', { value: 42 });
      expect(listener1).toHaveBeenCalledWith({ value: 42 });
      expect(listener2).toHaveBeenCalledWith({ value: 42 });
    });

    it('should return this for chaining', () => {
      const listener = vi.fn();
      const result = emitter.on('test:event', listener);
      expect(result).toBe(emitter);
    });
  });

  describe('emit()', () => {
    it('should call all registered listeners with payload', () => {
      const listener = vi.fn();
      emitter.on('test:message', listener);
      emitter.emit('test:message', 'hello');
      expect(listener).toHaveBeenCalledWith('hello');
    });

    it('should return true when listeners were called', () => {
      emitter.on('test:event', vi.fn());
      const result = emitter.emit('test:event', { value: 1 });
      expect(result).toBe(true);
    });

    it('should return false when no listeners are registered', () => {
      const result = emitter.emit('test:event', { value: 1 });
      expect(result).toBe(false);
    });

    it('should emit void events', () => {
      const listener = vi.fn();
      emitter.on('test:empty', listener);
      emitter.emit('test:empty', undefined);
      expect(listener).toHaveBeenCalledWith(undefined);
    });
  });

  describe('off()', () => {
    it('should remove a specific listener', () => {
      const listener = vi.fn();
      emitter.on('test:event', listener);
      emitter.off('test:event', listener);
      emitter.emit('test:event', { value: 42 });
      expect(listener).not.toHaveBeenCalled();
    });

    it('should not affect other listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      emitter.on('test:event', listener1);
      emitter.on('test:event', listener2);
      emitter.off('test:event', listener1);
      emitter.emit('test:event', { value: 42 });
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith({ value: 42 });
    });

    it('should return this for chaining', () => {
      const listener = vi.fn();
      emitter.on('test:event', listener);
      const result = emitter.off('test:event', listener);
      expect(result).toBe(emitter);
    });
  });

  describe('type safety', () => {
    it('should accept correctly typed payloads for events', () => {
      const listener = vi.fn<(data: { value: number }) => void>();
      emitter.on('test:event', listener);
      emitter.emit('test:event', { value: 123 });
      expect(listener).toHaveBeenCalledWith({ value: 123 });
    });

    it('should accept string payloads for string events', () => {
      const listener = vi.fn<(data: string) => void>();
      emitter.on('test:message', listener);
      emitter.emit('test:message', 'test message');
      expect(listener).toHaveBeenCalledWith('test message');
    });
  });

  describe('error handling', () => {
    it('should handle error event without throwing', () => {
      const errorHandler = vi.fn();
      emitter.on('error', errorHandler);
      const error = new Error('test error');
      emitter.emit('error', error);
      expect(errorHandler).toHaveBeenCalledWith(error);
    });

    it('should allow multiple error handlers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('error', handler1);
      emitter.on('error', handler2);
      const error = new Error('test error');
      emitter.emit('error', error);
      expect(handler1).toHaveBeenCalledWith(error);
      expect(handler2).toHaveBeenCalledWith(error);
    });
  });

  describe('once()', () => {
    it('should register a one-time listener', () => {
      const listener = vi.fn();
      emitter.once('test:event', listener);
      emitter.emit('test:event', { value: 1 });
      emitter.emit('test:event', { value: 2 });
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ value: 1 });
    });

    it('should return this for chaining', () => {
      const listener = vi.fn();
      const result = emitter.once('test:event', listener);
      expect(result).toBe(emitter);
    });
  });

  describe('removeAllListeners()', () => {
    it('should remove all listeners for a specific event', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      emitter.on('test:event', listener1);
      emitter.on('test:event', listener2);
      emitter.removeAllListeners('test:event');
      emitter.emit('test:event', { value: 42 });
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should not affect listeners for other events', () => {
      const eventListener = vi.fn();
      const messageListener = vi.fn();
      emitter.on('test:event', eventListener);
      emitter.on('test:message', messageListener);
      emitter.removeAllListeners('test:event');
      emitter.emit('test:message', 'hello');
      expect(messageListener).toHaveBeenCalledWith('hello');
    });
  });
});
