import React from 'react';
import {Application} from '@aos-mobile/core';
import {StockModule} from '@aos-mobile/app-stock';
import AuthModule from '@/modules/auth';
import ManufacturingModule from '@/modules/manufacturing';
import application_properties from '../package.json';

const App = () => {
  return (
    <Application
      modules={[StockModule, ManufacturingModule, AuthModule]}
      mainMenu="auth_menu_user"
      version={application_properties.version}
    />
  );
};

export default App;
