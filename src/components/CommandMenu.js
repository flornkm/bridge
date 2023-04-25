import React from 'react';
import { Command } from 'cmdk';

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
    <Command.Dialog open={props.open} onOpenChange={props.setOpen} className="fixed min-w-[712px] pb-8 shadow-xl bg-opacity-30 backdrop-blur-xl z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg ring-1 flex flex-col gap-8 ring-neutral-200">
      <Command.Input className="w-full bg-white ring-1 ring-neutral-200 focus:outline-offset-[-1px] rounded-t-lg text-base px-4 py-3" placeholder="What do you want to do?" />

      <Command.List className="p-4 max-h-80 overflow-y-scroll flex flex-col justify-start">
        <Command.Empty>No results found.</Command.Empty>

        {props.commands}
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandMenu;
