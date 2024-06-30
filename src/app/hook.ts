import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

// Use throughout your app instead of plain `useDispatch` and `useSelector`

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useChangeSreen = (cb?: () => void) => {
  const idTimer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    window.onresize = () => {
      clearTimeout(idTimer.current);
      idTimer.current = setTimeout(() => {
        if (cb) {
          cb();
        }
      }, 1000);
    };
  }, []);
};

export const useSearchProduct = () => {
  const location = useLocation();
  const nav = useNavigate();
  const instanceSearchParams = useSearchParams(
    (() => {
      console.log('useSearchProduct::: run');
      const urlSearch = new URLSearchParams(location.search);
      if (urlSearch.get('page') === null || urlSearch.get('page') === '') {
        urlSearch.set('page', '1');
      }
      if (urlSearch.get('limit') === null || urlSearch.get('limit') === '') {
        urlSearch.set('limit', '20');
      }
      if (urlSearch.get('categories') === null || urlSearch.get('categories') === '') {
        urlSearch.set('categories', 'all');
      }
      if (urlSearch.get('category') === null) {
        urlSearch.set('category', 'all');
      }
      if (urlSearch.get('categoryStatus') === null) {
        urlSearch.set('categoryStatus', 'all');
      }
      if (urlSearch.get('status') === null) {
        urlSearch.set('status', 'all');
      }
      if (urlSearch.get('option') === null) {
        urlSearch.set('option', 'all');
      }
      if (urlSearch.get('seo') === null) {
        urlSearch.set('seo', 'all');
      }
      if (urlSearch.get('soldOut') === null) {
        urlSearch.set('soldOut', 'all');
      }
      return urlSearch;
    })()
  );
  return instanceSearchParams;
};
