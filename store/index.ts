import { configureStore, Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./apis/authApi";
import {todosApi} from "./apis/todosApi"

type ApiModules = {
  [key: string]: {
    reducerPath: string;
    reducer: any;
    middleware: Middleware<Record<string, unknown>>;
  };
};

const combineApiReducersAndMiddleware = (apiModules: ApiModules) => {
  const reducers: Record<string, any> = {};
  const middleware: Middleware<Record<string, unknown>>[] = [];

  Object.keys(apiModules).forEach((moduleName) => {
    const api = apiModules[moduleName];
    reducers[api.reducerPath] = api.reducer;
    middleware.push(api.middleware);
  });

  return { reducers, middleware };
};

const { reducers, middleware } = combineApiReducersAndMiddleware({
  authApi,
  todosApi
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
