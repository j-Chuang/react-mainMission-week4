import { useState } from "react";
import UserProfile from "./components/UserProfile";

function PropTypesPractice() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    alert("UserProfile 被點擊了!");
  };

  const userData = {
    // name: "小明",
    age: 18,
    isStudent: true,
    hobbies: ["吃飯", "睡覺", "打動動"],
    address: {
      street: "中山路100號",
      city: "台北市",
    },
    friends: [
      { name: "漂亮阿姨", age: 21 },
      { name: "杰倫", age: 19 },
      { name: "小美", age: 16 },
    ],
    tags: [
      "喜歡漂亮阿姨",
      18,
      { type: "飲食", description: "喜歡鍋燒意麵" },
      true,
    ],
    status: "啟用", // '暫停', '未完成'
  };

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <UserProfile {...userData} handleClick={handleClick}/>
    </>
  );
}

export default PropTypesPractice;


