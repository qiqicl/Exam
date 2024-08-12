import React from 'react';
import { useRoutes } from 'react-router-dom'
import routeConfig from './router'

const App: React.FC = () => {
    const routes = useRoutes(routeConfig)
    return routes
};

export default App;