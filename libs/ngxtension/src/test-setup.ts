import {
	REACTIVE_NODE,
	ReactiveNode,
	setActiveConsumer,
} from '@angular/core/primitives/signals';
import { TestBed } from '@angular/core/testing';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
});
declare global {
	namespace jest {
		interface It {
			injectable: (
				name: string,
				fn: (() => void) | (() => PromiseLike<unknown>),
				timeout?: number,
			) => void;
		}

		interface Matchers<R> {
			toBeReactivePure: () => R;
		}
	}
}

it.injectable = (
	name: string,
	fn: (() => void) | (() => PromiseLike<unknown>),
	timeout?: number,
) => {
	it(name, () => TestBed.runInInjectionContext(fn), timeout);
};

expect.extend({
	toBeReactivePure: function (
		this: jest.MatcherContext,
		fn: () => void,
	): jest.CustomMatcherResult {
		const reactiveNode: ReactiveNode = Object.create(REACTIVE_NODE);
		const prevConsumer = setActiveConsumer(reactiveNode);

		reactiveNode.consumerAllowSignalWrites = true;

		try {
			fn();
		} finally {
			setActiveConsumer(prevConsumer);
		}

		if (reactiveNode.producers) {
			return {
				message: () =>
					`Expected to be reactive pure: Found ${reactiveNode.producers} producers`,
				pass: false,
			};
		}

		return {
			message: () => `Expected to be not reactive pure`,
			pass: true,
		};
	},
});
