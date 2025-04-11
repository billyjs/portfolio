"use client";

import { generate } from "random-words";

import { AsciiBackground, HiddenMessage } from "@/components/ascii-background";
import { Terminal } from "@/components/terminal";
import { TerminalWindow } from "@/components/terminal-window";

const developerMessage = "developer: Billy Schulze";
const envMessage = `env:       ${process.env.ENV}`;
const versionMessage = `version:   ${process.env.VERSION}`;
const timestampMessage = `build:     ${process.env.BUILD_TIME}`;

const maxLength = Math.max(
  developerMessage.length,
  versionMessage.length,
  timestampMessage.length,
  envMessage.length
);

const ceaserCipher = (message: string, shift: number) => {
  return message.split("").map((char) => {
    const index = char.charCodeAt(0) - 97;
    return String.fromCharCode((index + shift) % 26 + 97);
  }).join("");
};

const shift = Math.floor(Math.random() * 26);

const secret = generate({ minLength: 5, maxLength: 12 }) as string;

console.log(secret);

const secretMessage = JSON.stringify({
  secret_message: ceaserCipher(secret, shift),
  ceaser: shift,
}, null, 2).replaceAll(/[\n\r\s]+/g, ' ');

const messages: HiddenMessage[] = [
  {
    top: 2,
    left: 5,
    message: "hello world",
  },
  {
    row: (rows) => Math.floor(Math.random() * 4) + rows - 6,
    col: (cols, length) => Math.floor(Math.random() * (cols - length)),
    message: secretMessage,
  },
  {
    top: 2,
    right: 4,
    length: maxLength,
    message: versionMessage,
  },
  {
    top: 5,
    right: 4,
    length: maxLength,
    message: developerMessage,
  },
  {
    top: 3,
    right: 4,
    length: maxLength,
    message: envMessage,
  },
  {
    top: 4,
    right: 4,
    length: maxLength,
    message: timestampMessage,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen bg-black items-center justify-center p-4 md:p-8">
      <AsciiBackground messages={messages} />
      <TerminalWindow>
        <Terminal secret={secret} />
      </TerminalWindow>
    </main>
  );
}
