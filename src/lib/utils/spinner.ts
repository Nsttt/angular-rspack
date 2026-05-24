/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import { colors } from './color';
import { isTTY } from './tty';

interface SpinnerLike {
  text: string;
  isSpinning: boolean;
  succeed(text?: string): void;
  fail(text?: string): void;
  stop(): void;
  start(text?: string): void;
}

export class Spinner {
  private readonly spinner: SpinnerLike;

  /** When false, only fail messages will be displayed. */
  enabled = true;
  readonly #isTTY = isTTY();

  constructor(text?: string) {
    this.spinner = new BasicSpinner(text === undefined ? '' : text + '\n');
  }

  set text(text: string) {
    this.spinner.text = text;
  }

  get isSpinning(): boolean {
    return this.spinner.isSpinning || !this.#isTTY;
  }

  succeed(text?: string): void {
    if (this.enabled) {
      this.spinner.succeed(text);
    }
  }

  fail(text?: string): void {
    this.spinner.fail(text && colors.redBright(text));
  }

  stop(): void {
    this.spinner.stop();
  }

  start(text?: string): void {
    if (this.enabled) {
      this.spinner.start(text);
    }
  }
}

class BasicSpinner implements SpinnerLike {
  text: string;
  isSpinning = false;

  constructor(text: string) {
    this.text = text;
  }

  succeed(text?: string): void {
    this.isSpinning = false;
    if (text) {
      console.log(text);
    }
  }

  fail(text?: string): void {
    this.isSpinning = false;
    if (text) {
      console.error(text);
    }
  }

  stop(): void {
    this.isSpinning = false;
  }

  start(text?: string): void {
    this.isSpinning = true;
    if (text) {
      this.text = text;
    }
  }
}
