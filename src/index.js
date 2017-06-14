import angular from 'angular';

// Containers
import {DomEngine} from './app/containers/DomEngine';

// Services
import {DomEngineService} from './app/DomEngineService';

// Components
import {About} from './app/components/About';
import {AdvancedOptions} from './app/components/AdvancedOptions';
import {Card} from './app/components/Card';
import {CardList} from './app/components/CardList';
import {ExpansionList} from './app/components/ExpansionList';
import {Inventory} from './app/components/Inventory';
import {Nav} from './app/components/Nav';
import {Playmat} from './app/components/Playmat';
import {SearchForm} from './app/components/SearchForm';
import {Share} from './app/components/Share';
import {Welcome} from './app/components/Welcome';

// Directives
import CheckLoaded from './app/directives/CheckLoaded';

// Other
import 'angular-ui-router';
import 'angular-animate';
import 'ngstorage';
import 'angularjs-slider';
import 'angular-socialshare';
import 'angular-clipboard';

// App
import routesConfig from './routes';
import logConfig from './log';
import runConfig from './run';

// Styles
import './scss/index.scss';

angular
  .module('app', ['ui.router', 'ngAnimate', 'ngStorage', 'rzModule', '720kb.socialshare', 'angular-clipboard'])
  .config(routesConfig)
  .config(logConfig)
  .service('DomEngineService', DomEngineService)
  .component('about', About)
  .component('advancedOptions', AdvancedOptions)
  .component('cardList', CardList)
  .component('domengine', DomEngine)
  .component('domengineNav', Nav)
  .component('dominionCard', Card)
  .component('expansionList', ExpansionList)
  .component('inventory', Inventory)
  .component('playmat', Playmat)
  .component('searchForm', SearchForm)
  .component('share', Share)
  .component('welcome', Welcome)
  .directive('checkLoaded', CheckLoaded)
  .run(runConfig);
