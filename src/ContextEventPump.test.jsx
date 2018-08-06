import React from 'react';
import ReactDOM from 'react-dom';
import { ContextEventPump } from './ContextEventPump';

it('renders without crashing', () => {
  ReactDOM.render((
    <ContextEventPump>
      {({ alertAll, watchFor }) => (
        <div>
          Dispatch away...
        </div>
      )}
    </ContextEventPump>
  ), document.createElement('div'));
});
