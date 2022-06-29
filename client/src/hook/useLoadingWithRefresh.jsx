import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { refreshToken } from '../http';
import { setAuth } from '../store/authSlice';

const useLoadingWithRefresh = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await refreshToken();

        dispatch(setAuth(data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
};

export default useLoadingWithRefresh;
