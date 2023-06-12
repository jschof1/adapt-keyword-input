import components from 'core/js/components';
import ThoughtsModel from './thoughtsModel';
import ThoughtsView from './thoughtsView';

export default components.register('thoughts', {
  model: ThoughtsModel,
  view: ThoughtsView
});
