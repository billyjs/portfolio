"use client"

type Command = {
  name: string
  description: string
}

export function useAutoComplete(commands: Command[]) {
  const getCompletions = (partial: string) => {
    if (!partial) return []

    const lowerPartial = partial.toLowerCase()
    return commands.filter((cmd) => cmd.name.toLowerCase().startsWith(lowerPartial)).map((cmd) => cmd.name)
  }

  const completeCommand = (partial: string) => {
    const completions = getCompletions(partial)

    if (completions.length === 1) {
      return completions[0]
    }

    return null
  }

  return {
    getCompletions,
    completeCommand,
  }
}
