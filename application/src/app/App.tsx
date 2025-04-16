import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <button
          className="p-4 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition duration-300"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
