import type { Follows } from "../types"
import { api } from "./api"

export const followApi = api.injectEndpoints({
  endpoints: builder => ({
    followUser: builder.mutation<void, { followingId: number }>({
      query: body => ({
        url: `/follow`,
        method: "POST",
        body,
      }),
    }),
    unfollowUser: builder.mutation<void, { followingId: number }>({
      query: body => ({
        url: `/unfollow`,
        method: "DELETE",
        body,
      }),
    }),
  }),
})

export const { useFollowUserMutation, useUnfollowUserMutation } = followApi
export const {
  endpoints: { followUser, unfollowUser },
} = followApi
