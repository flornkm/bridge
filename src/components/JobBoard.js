import { useState, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
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

function JobBoard({ data, session, id, colors, confetti, setConfetti, effects, items, setItems }) {
  const supabase = useSupabaseClient();
  const [activeId, setActiveId] = useState(null);

  // const [items, setItems] = useState(data.content);

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

  const update = async (items) => {
    supabase
      .from("projects")
      .update({ content: items })
      .eq("id", id.replace(session.user.id, ""))
      .eq("owner", session.user.id)
      .then((res) => {
      });
  };

  const changeInput = (e, id, index, type) => {
    setItems((items) => {
      const newItems = [...items];
      const itemIndex = newItems.findIndex((item) => item.id === id);
      if (type === "label") {
        newItems[itemIndex].content[index].label = e.target.value;
      } else if (type === "required") {
        newItems[itemIndex].content[index].required = !newItems[itemIndex].content[index].required;
      } else if (type === "visibility") {
        newItems[itemIndex].content[index].visibility = !newItems[itemIndex].content[index].visibility;
      } else {
        newItems[itemIndex].content[index].content = e.target.value;
      }
      return newItems;
    });
    if (type === "required" || type === "visibility") {
      update(items);
    }
  };

  const deleteItem = (id) => {
    setItems((items) => {
      const newItems = [...items];
      const itemIndex = newItems.findIndex((item) => item.id === id);
      newItems.splice(itemIndex, 1);
      update(newItems);
      return newItems;
    });
  };

  const handleBlur = () => {
    update(items);
  };

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

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
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        update(arrayMove(items, oldIndex, newIndex));
        return arrayMove(items, oldIndex, newIndex);
      });

    }
  }, []);

  return (
    <div className="absolute top-[20%] left-[50%] h-fit translate-x-[-50%] flex gap-10 justify-between px-24 py-24 bg-white ring-1 ring-neutral-200 rounded-t-2xl max-w-[80%] w-full shadow-lg pb-96 flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-8 justify-between w-full max-md:flex-col max-md:gap-4">
            {data &&
              items.map((item, index) => {
                return (
                  <SortableItem
                    key={index}
                    id={item.id}
                    index={index}
                    items={item}
                    setItems={setItems}
                    onBlur={handleBlur}
                    changeInput={changeInput}
                    className={"bg-transparent " + (item.content[0].type.includes("heading") ? "text-2xl" : "text-base flex gap-4 items-center")}
                    colors={colors}
                    effects={effects}
                    confetti={confetti}
                    setConfetti={setConfetti}
                    deleteItem={deleteItem}
                  />
                );
              })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default JobBoard