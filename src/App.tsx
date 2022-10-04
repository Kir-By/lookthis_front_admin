import React, {FC} from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './common/components/layout/Layout';
import Home from './pages/home';

const App: FC = () => {

  console.log('test2');
  
  return (
    <>
      <div className="App">
        <Layout>
          <Home />
        </Layout>
      </div>
    </>
  );
};

export default App;
