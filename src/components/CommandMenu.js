import React from 'react';
import { Command } from 'cmdk';
import * as Icon from 'phosphor-react'

const CommandMenu = (props) => {
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && e.metaKey) {
        props.setOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Command.Dialog open={props.open} onOpenChange={props.setOpen} className="fixed min-w-[712px] pb-8 shadow-xl bg-opacity-50 backdrop-blur-lg z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg ring-1 flex flex-col gap-8 ring-zinc-200">
      <Command.Input className="w-full bg-white ring-1 ring-zinc-200 focus:outline-offset-[-1px] rounded-t-lg text-base px-4 py-3" placeholder="What do you want to do?" />

      <Command.List className="p-4 h-80 overflow-y-scroll flex flex-col justify-start">
        <Command.Empty>No results found.</Command.Empty>

        {props.commands && props.commands.map((command) => (
          command.type === "command" ?
          <Command.Item
            tabIndex={0}
            value={command.name}
            key={command.id}
            className="mb-4 text-base text-black focus:outline-none selection:bg-opacity-5 flex items-center gap-3 outline-none p-2 cursor-pointer transition-all bg-black hover:bg-opacity-5 aria-selected:bg-opacity-5 bg-opacity-0 rounded-md"
            onSelect={() => {
              props.setOpen(false);
              command.action()
            }}>
            {command.name === "Create New Project" && <Icon.FolderSimplePlus size={18} weight="bold" />}
            {command.name.includes("Open") && <Icon.FolderSimple size={18} weight="bold" />}
            {command.name}
          </Command.Item> :
          <Command.Group key={command.id} className="text-sm px-2 text-gray-500 pb-4" heading={command.name}>
            {command.content.map((subcommand) => (
              <Command.Item
                tabIndex={0}
                value={subcommand.name}
                key={subcommand.id}
                className="my-1 text-base text-black focus:outline-none selection:bg-opacity-5 flex items-center gap-3 outline-none p-2 cursor-pointer transition-all bg-black hover:bg-opacity-5 aria-selected:bg-opacity-5 bg-opacity-0 rounded-md"
                onSelect={() => {
                  props.setOpen(false);
                  subcommand.action()
                }}>
                {subcommand.name === "Create New Project" && <Icon.FolderSimplePlus size={18} weight="bold" />}
                {subcommand.name.includes("Open") && <Icon.FolderSimple size={18} weight="bold" />}
                {subcommand.name}
              </Command.Item>
        ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandMenu;
