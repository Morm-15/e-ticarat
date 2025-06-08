// src/App.jsx
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";  // استيراد التوجيه من AppRoutes

function App() {
  return <RouterProvider router={router} />;  // استخدام التوجيه هنا
}

export default App;
