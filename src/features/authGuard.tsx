import React from "react"
import { useCurrentQuery } from "../app/services/userApi"
import { Spinner } from "@nextui-org/react"

export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { isLoading, isError } = useCurrentQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner
          size="lg"
          color="primary"
          label="Загрузка..."
          labelColor="primary"
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold mb-2">Ошибка авторизации</h2>
          <p className="text-default-500">Пожалуйста, войдите в систему</p>
        </div>
      </div>
    )
  }

  return children
}
