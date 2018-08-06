import React from 'react';
import PropTypes from 'prop-types';

const EventPumpContext = React.createContext(new class {
  queue = [];
  watch = [];

  alertAll = (label, options) => {
    console.log(`. alert ${label} ${JSON.stringify(options)}`);

    for (const w of this.watch) {
      if (w.match.some((l) => l === label) === true) {
        w.receive(label, options);
      }
    }
  };

  watchFor = (label, receive) => {
    console.log(`. watch ${label}`);

    if (!label) {
      this.watch = this.watch.filter((w) => w.receive !== receive);
    }
    else {
      for (const w of this.watch) {
        if (w.receive === receive) {
          for (const l of w.match) {
            if (l === label) {
              return;
            }
          }

          w.match.push(label);

          return;
        }
      }

      this.watch.push({
        receive: receive,
        match: [
          label,
        ],
      });
    }
  }

});

/**
 * ContextEventPump
 * 
 * ...
 */
export class ContextEventPump extends React.PureComponent {

  render() {
    const { children } = this.props;

    return (
      <EventPumpContext.Consumer>
        {(pump) => children({ alertAll: pump.alertAll, watchFor: pump.watchFor })}
      </EventPumpContext.Consumer>
    );
  }

  static propTypes = {
    children: PropTypes.func.isRequired,
  };

}
