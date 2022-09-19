import React, {FC} from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './common/components/layout/Layout';

const App: FC = () => {
  return (
    <>
      <div className="App">
        <Layout></Layout>
      </div>
    </>
  );
};

export default App;
