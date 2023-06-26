import Album  from './components/Album';
import Server from './components/Server';
import Todo from './components/Todo';

import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div>
      
      
      
      <Routes>
        <Route path="/" element={<Server />} />
        <Route path="/Album.jsx" element={<Album />} />
        <Route path="/Todo.jsx" element={<Todo />} />
      </Routes>
    </div>
  );
}

export default App;
