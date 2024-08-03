import React from "react"

import { Card as NextUiCard } from "@nextui-org/react"

type Props = {
  avatarUrl: string
  name: string
  authorId: string
  commentId?: string
  likesCount?: number
  commentsCount?: number
  createdAt: Date
  id?: string
  cardFor: "comment" | "post" | "current-post"
  likedByUser?: boolean
}

export const Card = () => {
  return <div>Card</div>
}
