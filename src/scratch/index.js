import React, {useEffect} from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const alarmMachine = createMachine({
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
});

export const ScratchApp = () => {
   const [state, send] = useMachine(alarmMachine);

   const status = state.value;

    useEffect(() => {
        if(status === 'pending') {
            const timer = setTimeout(() => {
                send('SUCCESS')
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
        <div className="alarmToggle" style={{opacity: status === "pending" ? .5 : 1}} data-active={status === 'active' ? 'true' : undefined} onClick={() => send( 'TOGGLE')}></div>
      </div>
    </div>
  );
};
