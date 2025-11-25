import { useEffect } from "react";
import Layout from "./components/Layout.jsx";
import RoutesDef from "./RoutesDef.jsx";

function App() {
  useEffect(() => {
    //nap main.js sau khi react da tai Virtual DOM
    const script = document.createElement("script");
    script.src = "/js/main.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Layout>
      <RoutesDef />
    </Layout>
  );
}

export default App;
