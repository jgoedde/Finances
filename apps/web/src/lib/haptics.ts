import { WebHaptics } from "web-haptics";

/*
 * Haptic feedback on mobile, as named moments. This is the only module that
 * knows about `web-haptics`; tune the patterns here.
 *
 * Fire a moment synchronously in the handler of the gesture that caused it:
 * iOS Safari only gives feedback from inside a user gesture. Never await it.
 * Desktop gets nothing.
 */

let instance: WebHaptics | undefined;

function trigger(input: Parameters<WebHaptics["trigger"]>[0]) {
    instance ??= new WebHaptics();
    void instance.trigger(input);
}

/**
 * A light tick: something was picked (selection controls, month swipe,
 * long-press menu, undo).
 */
export function tick() {
    trigger([{ duration: 10, intensity: 0.3 }]);
}

/**
 * A double tap: something was saved.
 */
export function saved() {
    trigger("success");
}

/**
 * A strong then a soft tap: something was deleted.
 */
export function deleted() {
    trigger("nudge");
}

/**
 * Three sharp taps: a submit was refused.
 */
export function error() {
    trigger("error");
}
