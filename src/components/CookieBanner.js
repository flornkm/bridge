import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import debounce from "lodash/debounce";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from './SortableItem';

function CookieBanner({ data, session, id }) {
  const supabase = useSupabaseClient();
  const [inputValues, setInputValues] = useState(
    data.content[0].content.map((item) => item.text)
  );
  const [buttonValues, setButtonValues] = useState(
    data.content[1].content.map((item) => item.text)
  );
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const styling = (item) => {
    let cssStyles = {};
    for (const [key, value] of Object.entries(item.styles)) {
      cssStyles[key] = value;
    }
    return cssStyles;
  };

  const debouncedUpdateContent = debounce((newContent) => {
    supabase
      .from("projects")
      .update({ elements: newContent })
      .eq("id", id.replace(session.user.id, ""))
      .eq("owner", session.user.id)
      .then((res) => {
        console.log(res);
      });
  }, 1000);

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    setInputValues((prevState) => {
      const newValues = [...prevState];
      newValues[index] = value;
      return newValues;
    });
  };

  const handleButtonChange = (event, index) => {
    const { value } = event.target;
    setButtonValues((prevState) => {
      const newValues = [...prevState];
      newValues[index] = value;
      return newValues;
    });
  };

  const handleInputBlur = (index) => {
    // Update the content in the database
    const newContent = JSON.parse(JSON.stringify(data));
    newContent.content[0].content[index].text = inputValues[index];
    supabase
      .from("projects")
      .update({ elements: newContent })
      .eq("id", id.replace(session.user.id, ""))
      .eq("owner", session.user.id)
      .then((res) => {
        console.log(res);
      });
  };

  const handleButtonBlur = (index) => {
    // Update the content in the database
    const newContent = JSON.parse(JSON.stringify(data));
    newContent.content[1].content[index].text = buttonValues[index];
    supabase
      .from("projects")
      .update({ elements: newContent })
      .eq("id", id.replace(session.user.id, ""))
      .eq("owner", session.user.id)
      .then((res) => {
        console.log(res);
      });
  };

  function handleDragEnd(event) {
  const {active, over} = event;
  
  if (active.id !== over.id) {
    setItems((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });
  }
}

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] flex gap-10 justify-between translate-y-[-50%] px-10 py-4 bg-white ring-1 ring-neutral-200 rounded-2xl max-w-[80%] w-full shadow-lg">
      <div className="flex flex-col gap-2 items-start w-full">
        {data.content[0].content.map((item, index) => {
          return (
            <input
              key={index}
              value={inputValues[index]}
              style={{
                ...styling(item),
                fontWeight: item.styles["font-weight"],
              }}
              className="w-full focus:outline-neutral-100 focus:bg-neutral-100 rounded-sm transition-all outline-transparent"
              onChange={(event) => handleInputChange(event, index)}
              onBlur={() => handleInputBlur(index)}
            />
          );
        })}
      </div>
      <div className="flex gap-6">
        {data.content[1].content.map((item, index) => {
          return (
            <button
              key={index}
              style={{
                ...styling(item),
                fontWeight: item.styles["font-weight"],
              }}
              className="w-full px-8 focus:outline-neutral-100 focus:bg-neutral-100 rounded-xl hover:opacity-90 transition-all"
            >
              <input
                value={buttonValues[index]}
                onChange={(event) => {
                  handleButtonChange(event, index);
                }}
                onBlur={() => {
                  handleButtonBlur(index);
                }}
                style={{ ...styling(item) }}
                className="focus:outline-none w-full text-center"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CookieBanner;
