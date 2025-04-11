"use client";

import type React from "react";

import { JSX, useEffect, useRef, useState } from "react";

type Command = {
  command: string;
  description: string;
  action: (
    args?: string[]
  ) => string | JSX.Element | Promise<string | JSX.Element>;
};

type HistoryItem = {
  command: string;
  output: string | JSX.Element;
};

export function Terminal({ secret }: { secret: string }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [position, setPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Available commands
  const commands: Command[] = [
    {
      command: "help",
      description: "Show available commands",
      action: () => {
        return (
          <div className="mt-2">
            <p className="text-green-400">Available commands:</p>
            {commands.map((cmd) => (
              <div
                key={cmd.command}
                className="grid grid-cols-[200px_2fr] gap-2 mt-1"
              >
                <span className="text-yellow-300">{cmd.command}</span>
                <span className="text-gray-400">{cmd.description}</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      command: "about",
      description: "Display information about me",
      action: () => {
        return (
          <div className="mt-2">
            <p className="text-gray-300">
              Billy Schulze - Software Engineer at Atlassian
            </p>
          </div>
        );
      },
    },
    {
      command: "projects",
      description: "View my projects",
      action: () => {
        const projects = [
          {
            name: "this",
            tech: "React, Node.js, Typescript, Tailwind CSS",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
        ];

        return (
          <div className="mt-2">
            <p className="text-green-400 font-bold">Projects:</p>
            {projects.map((project, index) => (
              <div key={index} className="mt-3 border-l-2 border-gray-700 pl-3">
                <p className="text-yellow-300 font-bold">{project.name}</p>
                <p className="text-blue-400 text-sm">Tech: {project.tech}</p>
                <p className="text-gray-300 mt-1">{project.description}</p>
              </div>
            ))}
            <p className="mt-3 text-gray-400">
              Type &apos;project [name]&apos; for more details about a specific project.
            </p>
          </div>
        );
      },
    },
    {
      command: "contact",
      description: "Get my contact information",
      action: () => {
        return (
          <div className="mt-2">
            <p className="text-green-400 font-bold">Contact Information:</p>
            <div className="grid grid-cols-[120px_1fr] gap-2 mt-2">
              <span className="text-yellow-300">Email:</span>
              <a className="text-gray-300" href="mailto:dev@billy.id.au">
                dev@billy.id.au
              </a>

              <span className="text-yellow-300">LinkedIn:</span>
              <a
                className="text-gray-300"
                href="https://linkedin.com/in/billyschulze"
                target="_blank"
              >
                linkedin.com/in/billyschulze
              </a>

              <span className="text-yellow-300">GitHub:</span>
              <a
                className="text-gray-300"
                href="https://github.com/billyjs"
                target="_blank"
              >
                github.com/billyjs
              </a>
            </div>
          </div>
        );
      },
    },
    {
      command: "experience",
      description: "View my work experience",
      action: () => {
        const experiences = [
          {
            role: "Software Engineer",
            company: "Atlassian",
            period: "2020 - Present",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
        ];

        return (
          <div className="mt-2">
            <p className="text-green-400 font-bold">Work Experience:</p>
            {experiences.map((exp, index) => (
              <div key={index} className="mt-3">
                <div className="flex justify-between">
                  <p className="text-yellow-300 font-bold">{exp.role}</p>
                  <p className="text-blue-400">{exp.period}</p>
                </div>
                <p className="text-gray-400">{exp.company}</p>
                <p className="text-gray-300 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      command: "clear",
      description: "Clear the terminal",
      action: () => {
        setHistory([]);
        return "";
      },
    },
    {
      command: "resume",
      description: "Download my resume",
      action: () => {
        return (
          <div className="mt-2">
            <p className="text-green-400">
              Downloading resume...{" "}
              <span className="text-yellow-300">[simulation]</span>
            </p>
            <p className="text-gray-400 mt-1">
              In a real implementation, this would trigger a download of a PDF
              resume.
            </p>
          </div>
        );
      },
    },
    {
      command: "echo",
      description: "Echo a message",
      action: (args) => {
        if (args?.[0] === secret) {
          return <p className="mt-2 text-green-300">Congratulations! You found the secret message.</p>;
        }
        return <p className="mt-2 text-gray-300">{args?.join(" ") || ""}</p>;
      },
    },
    {
      command: "date",
      description: "Display current date and time",
      action: () => {
        return <p className="mt-2 text-gray-300">{new Date().toString()}</p>;
      },
    },
    {
      command: "whoami",
      description: "Display user information",
      action: () => {
        return <p className="mt-2 text-gray-300">JXuSzMh2</p>;
      },
    },
    {
      command: "cowsay",
      description: "Make a cow say something",
      action: (args) => {
        const message = args?.join(" ") || "Moo!";
        const maxLineLength = 40;

        // Word wrap function for longer messages
        const wrapText = (text: string, maxLength: number): string[] => {
          if (text.length <= maxLength) return [text];

          const lines: string[] = [];
          let currentLine = "";

          text.split(" ").forEach((word) => {
            if ((currentLine + word).length <= maxLength) {
              currentLine += (currentLine ? " " : "") + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          });

          if (currentLine) lines.push(currentLine);
          return lines;
        };

        const lines = wrapText(message, maxLineLength);
        const maxLength = Math.min(
          maxLineLength,
          Math.max(...lines.map((line) => line.length))
        );

        // Create the speech bubble
        const bubbleTop = ` ${"_".repeat(maxLength + 2)} `;
        const bubbleContent = lines.map((line, i) => {
          if (lines.length === 1) {
            return `< ${line.padEnd(maxLength, " ")} >`;
          } else if (i === 0) {
            return `/ ${line.padEnd(maxLength, " ")} \\`;
          } else if (i === lines.length - 1) {
            return `\\ ${line.padEnd(maxLength, " ")} /`;
          } else {
            return `| ${line.padEnd(maxLength, " ")} |`;
          }
        });
        const bubbleBottom = ` ${"-".repeat(maxLength + 2)} `;

        // Create the cow ASCII art
        const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
    `;

        return (
          <pre className="mt-2 text-yellow-300 whitespace-pre">
            {bubbleTop}
            {bubbleContent.map((line, i) => (
              <span key={i}>
                {line}
                {"\n"}
              </span>
            ))}
            {bubbleBottom}
            {cow}
          </pre>
        );
      },
    },
    {
      command: "cowthink",
      description: "Make a cow think something",
      action: (args) => {
        const message = args?.join(" ") || "Hmm...";
        const maxLineLength = 40;

        // Word wrap function for longer messages
        const wrapText = (text: string, maxLength: number): string[] => {
          if (text.length <= maxLength) return [text];

          const lines: string[] = [];
          let currentLine = "";

          text.split(" ").forEach((word) => {
            if ((currentLine + word).length <= maxLength) {
              currentLine += (currentLine ? " " : "") + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          });

          if (currentLine) lines.push(currentLine);
          return lines;
        };

        const lines = wrapText(message, maxLineLength);
        const maxLength = Math.min(
          maxLineLength,
          Math.max(...lines.map((line) => line.length))
        );

        // Create the thought bubble
        const bubbleTop = ` ${"_".repeat(maxLength + 2)} `;
        const bubbleContent = lines.map((line, i) => {
          if (lines.length === 1) {
            return `( ${line.padEnd(maxLength, " ")} )`;
          } else if (i === 0) {
            return `( ${line.padEnd(maxLength, " ")} )`;
          } else if (i === lines.length - 1) {
            return `( ${line.padEnd(maxLength, " ")} )`;
          } else {
            return `( ${line.padEnd(maxLength, " ")} )`;
          }
        });
        const bubbleBottom = ` ${"-".repeat(maxLength + 2)} `;

        // Create the thinking cow ASCII art
        const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
    `;

        // Add thought bubbles
        const bubble = "o";

        return (
          <pre className="mt-2 text-blue-300 whitespace-pre">
            {bubbleTop}
            {bubbleContent.map((line, i) => (
              <span key={i}>
                {line}
                {"\n"}
              </span>
            ))}
            {bubbleBottom}
            {`     ${bubble}\n`}
            {`      ${bubble}\n`}
            {cow}
          </pre>
        );
      },
    },
  ];

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      command: "",
      output: (
        <div>
          <p className="text-gray-400 mt-1">
            Welcome to Ubuntu 22.04 (GNU/Linux 5.15.0-125-generic x86_64)
          </p>
          <p className="text-gray-400 mt-1">
            Last login: Thu Apr 10 12:00:00 2025 from 127.0.0.1
          </p>
          <p className="text-gray-400 mt-1">
            Type &apos;help&apos; to see available commands.
          </p>
        </div>
      ),
    };
    setHistory([welcomeMessage]);
    // Focus the input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Process command when Enter is pressed
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const fullCommand = input.trim();
      const args = fullCommand.split(" ");
      const commandName = args[0].toLowerCase();
      const commandArgs = args.slice(1);

      // Add command to history
      const newHistoryItem: HistoryItem = {
        command: fullCommand,
        output: "",
      };

      // Find and execute command
      const command = commands.find((cmd) => cmd.command === commandName);
      if (command) {
        try {
          const result = await command.action(commandArgs);
          newHistoryItem.output = result;
        } catch (error) {
          console.error(error);
          newHistoryItem.output = (
            <p className="text-red-500">
              An error occurred while executing the command.
            </p>
          );
        }
      } else {
        newHistoryItem.output = (
          <p className="text-red-500">
            Command not found: {commandName}. Type &apos;help&apos; to see available
            commands.
          </p>
        );
      }

      setHistory((prev) => [...prev, newHistoryItem]);
      setInput("");
      setPosition(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Navigate command history (up)
      const commandHistory = history
        .filter((item) => item.command)
        .map((item) => item.command);
      if (commandHistory.length > 0 && position < commandHistory.length) {
        const newPosition = position + 1;
        setPosition(newPosition);
        setInput(commandHistory[commandHistory.length - newPosition]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Navigate command history (down)
      const commandHistory = history
        .filter((item) => item.command)
        .map((item) => item.command);
      if (position > 1) {
        const newPosition = position - 1;
        setPosition(newPosition);
        setInput(commandHistory[commandHistory.length - newPosition]);
      } else {
        setPosition(0);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Command auto-completion
      const partialCommand = input.toLowerCase();
      const matchingCommands = commands
        .map((cmd) => cmd.command)
        .filter((cmd) => cmd.startsWith(partialCommand));

      if (matchingCommands.length === 1) {
        setInput(matchingCommands[0]);
      } else if (matchingCommands.length > 1 && partialCommand) {
        // Show available completions
        const newHistoryItem: HistoryItem = {
          command: input,
          output: (
            <div className="mt-2">
              <p className="text-gray-400">Available completions:</p>
              <div className="flex flex-wrap gap-x-4">
                {matchingCommands.map((cmd) => (
                  <span key={cmd} className="text-yellow-300">
                    {cmd}
                  </span>
                ))}
              </div>
            </div>
          ),
        };
        setHistory((prev) => [...prev, newHistoryItem]);
      }
    }
  };

  return (
    <div
      ref={terminalRef}
      className="w-full h-full bg-gray-900 text-gray-100 font-mono p-4 overflow-y-auto"
      onClick={handleTerminalClick}
    >
      {/* Terminal history */}
      {history.map((item, index) => (
        <div key={index} className="mb-2">
          {item.command && (
            <div className="flex">
              <span className="text-green-400">~ &gt;</span>
              <span className="ml-2">{item.command}</span>
            </div>
          )}
          <div>{item.output}</div>
        </div>
      ))}

      {/* Command input */}
      <div className="flex items-center">
        <span className="text-green-400">~ &gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ml-2 bg-transparent outline-none border-none flex-1 caret-white"
          aria-label="Terminal input"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
