import { useRoutes } from "hookrouter";
import { routes } from "./Routes";

function App() {
    const routeResult = useRoutes(routes)
    return routeResult
}

export default App;
