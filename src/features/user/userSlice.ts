import { createSlice } from "@reduxjs/toolkit"
import type { User } from "../../app/types"
import { userApi } from "../../app/services/userApi"

interface InitialState {
  user: User | null
  isAuthenticated: boolean
  users: User[] | null
  current: User | null
  token?: string
}

const InitialState: InitialState = {
  user: null,
  isAuthenticated: false,
  users: null,
  current: null,
}

const slice = createSlice({
  name: "user",
  initialState: InitialState,
  reducers: {
    logout: () => InitialState,
    resetUser: state => {
      state.user = null
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addMatcher(userApi.endpoints.current.matchFulfilled, (state, action) => {
        state.isAuthenticated = true
        state.current = action.payload
      })
      .addMatcher(
        userApi.endpoints.getUserById.matchFulfilled,
        (state, action) => {
          state.user = action.payload
        },
      )
  },
})

export const { logout, resetUser } = slice.actions
export default slice.reducer
