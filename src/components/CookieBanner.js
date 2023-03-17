import React, { useEffect, useState, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import debounce from "lodash/debounce";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  sortableKeyboardCoordinates,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/layout/SortableItem";
import Item from "@/layout/Item";

export default function CookieBanner({ data, session, id }) {
  const supabase = useSupabaseClient();
  const [activeId, setActiveId] = useState(null);

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

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] flex gap-10 justify-between translate-y-[-50%] px-10 py-4 bg-white ring-1 ring-neutral-200 rounded-2xl max-w-[80%] w-full shadow-lg">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex justify-between w-full relative">
            {data &&
              items.map((item, index) => {
                return <SortableItem key={index} id={item} items={item} />;
              })}
          </div>
        </SortableContext>
        <DragOverlay adjustScale={true}>
          {activeId ? <Item id={activeId} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
