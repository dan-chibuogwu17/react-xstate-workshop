import React, {useEffect, useReducer} from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const alarmMachine = {
    initial: 'inactive',
    states: {
        inactive: {
            on: {
                TOGGLE: 'pending',
            },
        },
        pending: {
            on: {
                SUCCESS: 'active',
                TOGGLE: 'inactive',
            }
        },
        active: {
            on: {
                TOGGLE: 'inactive',
            },
        },
    },
};
const alarmReducer = (state, event) => {
    return alarmMachine.states[state].on[event.type] || state;
};

export const ScratchApp = () => {
   const [status, dispatch] = useReducer(alarmReducer, alarmMachine.initial)

    useEffect(() => {
        if(status === 'pending') {
            const timer = setTimeout(() => {
                dispatch({type: 'SUCCESS'})
            }, 1500);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [status]);

  return (
    <div className="scratch">
      <div className="alarm">
        <div className="alarmTime">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className="alarmToggle" style={{opacity: status === "pending" ? .5 : 1}} data-active={status === 'active' ? 'true' : undefined} onClick={() => dispatch({type: 'TOGGLE'})}></div>
      </div>
    </div>
  );
};
