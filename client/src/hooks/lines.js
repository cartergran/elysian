import { useEffect, useCallback, useMemo, useRef } from 'react';

const useAnimateLineOnAdd = (entityNames, selectedEntities) => {
  const prevSelectedRef = useRef(new Set(selectedEntities));
  const addedRef = useRef(new Set());

  const selectedKey = useMemo(() => [...selectedEntities].sort().join('|'), [selectedEntities]);

  useMemo(() => {
    const retVal = new Set();
    const prev = prevSelectedRef.current;

    for (const n of entityNames) {
      if (!prev.has(n) && selectedEntities.has(n)) {
        retVal.add(n);
      }
    }

    addedRef.current = retVal;
  }, [selectedKey]);

  useEffect(() => {
    prevSelectedRef.current = new Set(selectedEntities);

    if (addedRef.current.size > 0) {
      requestAnimationFrame(() => addedRef.current.clear());
    }
  }, [selectedKey]);

  return useCallback((n) => addedRef.current.has(n) || false, []);
};

export {
  useAnimateLineOnAdd
};
