import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import debounce from "lodash/debounce";

function CookieBanner({ data, session, id }) {
  const supabase = useSupabaseClient();
  const [inputValues, setInputValues] = useState(
    data.content[0].content.map((item) => item.text)
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
  
    const newContent = JSON.parse(JSON.stringify(data));
  
    const updateElementText = (element) => {
      if (element.text === inputValues[index]) {
        element.text = value;
      }
      if (element.content) {
        element.content.forEach((childElement) => {
          updateElementText(childElement);
        });
      }
    };
  
    updateElementText(newContent);
  
    debouncedUpdateContent(newContent);
  };
  
  
  

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-10 py-4 bg-white ring-1 ring-neutral-200 rounded-2xl max-w-[80%] w-full shadow-lg">
      <div className="flex flex-col gap-2">
        {data.content[0].content.map((item, index) => {
          return (
            <input
              key={index}
              value={inputValues[index]}
              style={{
                ...styling(item),
                fontWeight: item.styles["font-weight"],
              }}
              onChange={(event) => handleInputChange(event, index)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CookieBanner;
