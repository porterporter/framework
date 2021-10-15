import { Command } from '@lib/Command';
import { Event } from '@lib/Event';
import type { Ctor } from '@sapphire/utilities';

/**
 * Determines whether or not a value is a class.
 * @param value The piece to be checked.
 * @private
 */
export function isClass(value: unknown) {
	return typeof value === 'function' && typeof value.prototype === 'object';
}

/**
 * Checks whether or not the value class extends the base class.
 * @param value The constructor to be checked against.
 * @param base The base constructor.
 * @private
 */
export function classExtends<T extends Ctor>(value: Ctor, base: T) {
	let ctor: Ctor | null = value;
	while (ctor !== null) {
		if (ctor.constructor === base.constructor) return true;
		ctor = Object.getPrototypeOf(ctor);
	}

	return false;
}

export function isCommand(value: unknown): value is Command {
	if (typeof value === 'function' && typeof value.prototype === 'object') {
		return Reflect.get(value, 'prototype') instanceof Command;
	}
	return false;
}

export function isEvent(value: unknown): value is Event {
	if (typeof value === 'function' && typeof value.prototype === 'object') {
		return Reflect.get(value, 'prototype') instanceof Event;
	}
	return false;
}

