import { useState, useCallback, useRef, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { createPortal } from 'react-dom';
import SortableItem from "@/layout/SortableItem";
import Item from "@/layout/Item";

function JobBoard({ data, session, id, colors, confetti, setConfetti, effects, items, setItems }) {
  const supabase = useSupabaseClient();
  const [activeId, setActiveId] = useState(null);

  const rotationRect = useRef(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [prevMouseX, setPrevMouseX] = useState(null);
  const [prevTimestamp, setPrevTimestamp] = useState(null);

  useEffect(() => {
    let requestId = null;

    function handleMouseMove(event) {
      const { clientX } = event;
      const currentTimestamp = Date.now();
      if (prevMouseX !== null && prevTimestamp !== null) {
        const dx = clientX - prevMouseX;
        const dt = currentTimestamp - prevTimestamp;
        const speed = dx / dt;
        const maxRotationSpeed = 100; // adjust this value to control the maximum rotation speed
        const rotationSpeed = Math.min(Math.abs(speed), maxRotationSpeed) * Math.sign(speed);
        const rotationAngleDelta = rotationSpeed * dt / 10;
        requestId = requestAnimationFrame(() => {
          setRotationAngle(prevAngle => prevAngle + rotationAngleDelta);
        });
      }
      setPrevMouseX(clientX);
      setPrevTimestamp(currentTimestamp);
    }

    if (activeId !== null) {
      document.body.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.body.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(requestId);
      };
    }
  }, [activeId, prevMouseX, prevTimestamp]);

  useEffect(() => {
    if (rotationRect.current) {
      rotationRect.current.style.setProperty('--rotation-angle', `${Math.trunc(rotationAngle)}deg`);
    }
  }, [rotationAngle]);



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
    console.log(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragOver = useCallback((event) => {
    const { active } = event;
    setActiveId(active.id);
    const { over } = event;

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
    <div className="absolute top-[20%] left-[50%] h-fit translate-x-[-50%] flex gap-10 justify-between md:p-24 max-md:p-4 bg-white ring-1 ring-neutral-200 rounded-t-2xl max-md:pb-64 md:max-w-[80%] w-full shadow-lg pb-96 flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 gap-8 w-full max-md:flex-col max-md:gap-4 items-center">
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
        {createPortal(
          <DragOverlay
            modifiers={[restrictToWindowEdges]}
            zIndex={39}
            dropAnimation={{
              duration: 100,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {activeId ? (
              <div
                className={"ring-1 ring-neutral-200 shadow-xl scale-[1.01] transition-all rotate-[" + rotationAngle + "deg]"}
                ref={rotationRect}
                style={{
                  background: "white", borderRadius: "16px",
                }}>
                <Item
                  id={activeId}
                  index={items.findIndex((item) => item.id === activeId)}
                  items={items.find((item) => item.id === activeId)}
                  setItems={setItems}
                  onBlur={handleBlur}
                  changeInput={changeInput}
                  className={"bg-transparent text-base flex gap-4 items-center"}
                  colors={colors}
                  effects={effects}
                  confetti={confetti}
                  setConfetti={setConfetti}
                  deleteItem={deleteItem}
                  isDragging={true}
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  )
}

export default JobBoard