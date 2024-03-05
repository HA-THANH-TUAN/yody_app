import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useEffect, useRef } from 'react'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useChangeSreen=(cb?:(()=>void))=>{
    const idTimer = useRef<NodeJS.Timeout>();
    useEffect(()=>{
        window.onresize=()=>{
            clearTimeout(idTimer.current);
            idTimer.current =  setTimeout(() => {
                if(cb){
                    cb();
                }
            }, 1000);
        }
    },[]);
}