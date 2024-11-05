import {configureStore} from "@reduxjs/toolkit";

export const setupStore = () => {
    return configureStore();
}

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']