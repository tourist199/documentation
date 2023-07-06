import clsx from 'clsx';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import styles from './annotation.module.scss';
import { useClickAway } from '../../hooks';

export function Annotation({ children, id }) {
  const [open, setOpen] = useState(false);

  /**
   * Close the Annotation if it is open.
   */
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  /**
   * Toggle the Annotation visibility state, switching open/close.
   */
  const handleToggleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const annotationRef = useClickAway(handleClose);
  const annotationId = ('annotation' + (id ? `-${id}-` : '-') + (Math.random() * 10));

  /**
   * Close the Annotation content if it is open,
   * when the escape-key is pressed.
   */
  useLayoutEffect(() => {
    function escapeListener(event) {
      if (open && (event.key.toLowerCase() === 'escape')) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener('keydown', escapeListener);
    } else {
      window.removeEventListener('keydown', escapeListener);
    }

    return () => {
      window.removeEventListener('keydown', escapeListener);
    };
  }, [handleClose, open]);

  return (
    <span
      ref={annotationRef}
      id={annotationId}
      className={clsx(
        'annotation',
        styles['annotation'],
        (open && clsx(
          'annotation--open',
          styles['annotation--open'],
        )),
      )}
    >
      <button
        id={`${annotationId}-toggle`}
        type="button"
        className={clsx(
          'annotation__toggle',
          styles['annotation__toggle'],
          (open && clsx(
            'annotation__toggle--open',
            styles['annotation__toggle--open'],
          )),
        )}
        onClick={() => handleToggleClick()}
        aria-expanded={open}
        {...(open ? {
          'aria-controls': annotationId,
        } : {})}
      >
        <svg
          id={`${annotationId}-icon`}
          xmlns="http://www.w3.org/2000/svg"
          width="0.5rem"
          height="0.5rem"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden={true}
          className={clsx(
            'annotation__toggle__icon',
            styles['annotation__toggle__icon'],
          )}
        >
          <path
            fill="currentColor"
            d="M24 2.417 21.583 0 12 9.583 2.417 0 0 2.417 9.583 12 0 21.583 2.417 24 12 14.417 21.583 24 24 21.583 14.417 12 24 2.417Z"
          />
        </svg>
      </button>
      {open && (
        <span
          id={`${annotationId}-tooltip`}
          role="tooltip"
          tabIndex="-1"
          className={clsx(
            'annotation__tooltip',
            styles['annotation__tooltip'],
          )}
        >
          {children}
        </span>
      )}
    </span>
  );
}
