import React, { useEffect, useState, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import debounce from "lodash/debounce";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
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

  // const [items, setItems] = useState([
  //   [
  //     {
  //       type: "heading",
  //       text: "We use cookies",
  //     },
  //     {
  //       type: "text",
  //       text: "Please accept",
  //     },
  //   ],
  //   [
  //     {
  //       type: "primaryButton",
  //       text: "Allow",
  //     },
  //     {
  //       type: "secondaryButton",
  //       text: "Deny",
  //     },
  //   ],
  // ]);
  const [items, setItems] = useState(
    Array.from({ length: 4 }, (_, i) => (i + 1).toString())
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        tolerance: 5,
        delay: 150,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        tolerance: 5,
        delay: 150,
      },
    })
  );

  useEffect(() => {
    // setItems(data.content);
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
          <div className="flex justify-between w-full">
            {data &&
              items.map((id) => {
                return (
                  <SortableItem key={id} id={id} index={items.indexOf(id)} />
                );
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
