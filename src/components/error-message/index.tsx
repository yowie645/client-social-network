import React from "react"

export const ErrorMessage = ({ error = "" }: { error: string }) => {
  return (
    error && (
      <div className="bg-red-500 items-center py-3 px-3 rounded-md">
        <p className="text-white text-small">{error}</p>
      </div>
    )
  )
}
