import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import debounce from "lodash/debounce";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

function CookieBanner({ data, session, id }) {
  const supabase = useSupabaseClient();

  const [items, setItems] = useState([
    [
      {
        type: "heading",
        text: "We use cookies",
      },
      {
        type: "text",
        text: "Please accept",
      },
    ],
    [
      {
        type: "primaryButton",
        text: "Allow",
      },
      {
        type: "secondaryButton",
        text: "Deny",
      },
    ],
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(data.content);
    console.log(items);
  }, [data]);


  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] flex gap-10 justify-between translate-y-[-50%] px-10 py-4 bg-white ring-1 ring-neutral-200 rounded-2xl max-w-[80%] w-full shadow-lg">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {data &&
            items.map((item, index) => {
              return <SortableItem key={index} itemArray={item} />;
            })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default CookieBanner;
