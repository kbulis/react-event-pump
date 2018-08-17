import React from 'react';
import PropTypes from 'prop-types';

const EventPumpContext = React.createContext(new class {
  queue = [];
  watch = [];

  watchFor = (label, receiver) => {
    console.log(`. watch ${label}`);

    if (!label) {
      this.watch = this.watch.filter((w) => w.receiver !== receiver);
    }
    else {
      for (const w of this.watch) {
        if (w.receiver === receiver) {
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
        receiver: receiver,
        match: [
          label,
        ],
      });
    }
  }

  alertAll = (label, param) => {
    console.log(`. alert ${label} ${JSON.stringify(param)}`);

    for (const entry of this.watch) {
      if (entry.match.some((l) => l === label) === true) {
        entry.receiver(label, param, this.alertAll);
      }
    }
  };

});

/**
 * ContextEventPump
 * 
 * Accepts events to watch for, passing the alert all handler with each event.
 * If children is a single function, we assume a render is specified and pass
 * the eventing context object handlers.
 */
export class ContextEventPump extends React.PureComponent {

  render() {
    const { watching, children } = this.props;

    return (
      <EventPumpContext.Consumer>
        {(eventing) => <ContextEventBase eventing={eventing} watching={watching} children={children} />}
      </EventPumpContext.Consumer>
    );
  }

  static propTypes = {
    watching: PropTypes.array.isRequired,
  };

}

/**
 * ContextEventBase
 * 
 * Handles eventing lifecycle management for containing components.
 */
class ContextEventBase extends React.PureComponent {

  componentDidMount() {
    const { eventing, watching } = this.props;

    for (const watch of watching) {
      eventing.watchFor(watch.label, watch.receiver);
    }
  }

  componentWillUnmount() {
    const { eventing, watching } = this.props;

    for (const watch of watching) {
      eventing.watchFor('', watch.receiver);
    }
  }

  render() {
    const { eventing, children } = this.props;

    if (typeof children === 'function') {
      return children({ alertAll: eventing.alertAll, watchFor: eventing.watchFor }) || null;
    }

    return children || null;
  }

  static propTypes = {
    watching: PropTypes.array.isRequired,
    eventing: PropTypes.object,
  };

}
