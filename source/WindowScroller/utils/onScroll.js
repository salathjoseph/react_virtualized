// @flow
'no babel-plugin-flow-react-proptypes';

import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
} from '../../utils/requestAnimationTimeout';
import type WindowScroller from '../WindowScroller.js';

// Checking a component's props is unreliable. Instead we store the element used at the time
type MountedInstancesReference = {
  component: WindowScroller,
  element: Element,
};

let mountedInstances: MountedInstancesReference[] = [];
let originalBodyPointerEvents = null;
let disablePointerEventsTimeoutId = null;

function enablePointerEventsIfDisabled() {
  if (disablePointerEventsTimeoutId) {
    disablePointerEventsTimeoutId = null;

    if (document.body && originalBodyPointerEvents != null) {
      document.body.style.pointerEvents = originalBodyPointerEvents;
    }

    originalBodyPointerEvents = null;
  }
}

function enablePointerEventsAfterDelayCallback() {
  enablePointerEventsIfDisabled();
  mountedInstances.forEach(mi => mi.component.__resetIsScrolling());
}

function enablePointerEventsAfterDelay() {
  if (disablePointerEventsTimeoutId) {
    cancelAnimationTimeout(disablePointerEventsTimeoutId);
  }

  var maximumTimeout = 0;
  mountedInstances.forEach(mi => {
    maximumTimeout = Math.max(
      maximumTimeout,
      mi.component.props.scrollingResetTimeInterval,
    );
  });

  disablePointerEventsTimeoutId = requestAnimationTimeout(
    enablePointerEventsAfterDelayCallback,
    maximumTimeout,
  );
}

function onScrollWindow(event: Event) {
  if (
    event.currentTarget === window &&
    originalBodyPointerEvents == null &&
    document.body
  ) {
    originalBodyPointerEvents = document.body.style.pointerEvents;

    document.body.style.pointerEvents = 'none';
  }
  enablePointerEventsAfterDelay();
  mountedInstances.forEach(mi => {
    if (mi.component.props.scrollElement === event.currentTarget) {
      mi.component.__handleWindowScrollEvent();
    }
  });
}

export function registerScrollListener(
  component: WindowScroller,
  element: Element,
) {
  if (!mountedInstances.some(mi => mi.element === element)) {
    element.addEventListener('scroll', onScrollWindow);
  }

  mountedInstances.push({component, element});
}

export function unregisterScrollListener(
  component: WindowScroller,
  element: Element,
) {
  // Remove the given component from our known instances
  mountedInstances = mountedInstances.filter(mi => mi.component !== component);

  if (
    !mountedInstances.length || // If current length is 0, remove listener
    !mountedInstances.some(mi => mi.element === element) // No current mounted instances have the element
  ) {
    element.removeEventListener('scroll', onScrollWindow);
    if (disablePointerEventsTimeoutId) {
      cancelAnimationTimeout(disablePointerEventsTimeoutId);
      enablePointerEventsIfDisabled();
    }
  }
}
